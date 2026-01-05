from fastapi import APIRouter, HTTPException, Depends
from app.utils.deps import get_current_user
from app.database import db
from app.models.request import RideRequestCreate
from app.utils.serializers import sanitize_doc
from bson import ObjectId
from datetime import datetime,date

router = APIRouter(prefix="/requests")

@router.post("/ride/{ride_id}")
async def request_seat(
    ride_id: str,
    current_user: dict = Depends(get_current_user)
):
    # 1. Only passengers can request seats
    if current_user["role"] not in ["passenger", "both"]:
        raise HTTPException(status_code=403, detail="Only passengers can request seats")

    # 2. Validate ride_id format
    try:
        ride_oid = ObjectId(ride_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid ride ID format")

    # 3. Fetch ride
    ride = await db.rides.find_one({"_id": ride_oid})
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    # 4. Ride must be open
    if ride["status"] != "open":
        raise HTTPException(status_code=400, detail="Ride is not open for booking")

    if ride["date"].date() < date.today():
        raise HTTPException(
            status_code=400,
            detail="Cannot request seats for a past ride"
        )
    # 5. Ride must have available seats
    if ride["seats_available"] <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    # 6. Passenger cannot request own ride
    if ride["driver_id"] == current_user["id"]:
        raise HTTPException(status_code=400, detail="You cannot request your own ride")


    # 7. Prevent duplicate requests
    existing_request = await db.ride_requests.find_one({
        "ride_id": ride_id,
        "passenger_id": current_user["id"]
    })
    if existing_request:
        raise HTTPException(status_code=400, detail="You have already requested this ride")

    # 8. Create request
    new_request = {
        "ride_id": ride_id,
        "passenger_id": current_user["id"],
        "status": "pending",
        "created_at": datetime.utcnow()
    }

    await db.ride_requests.insert_one(new_request)

    return {"message": "Seat request submitted successfully"}

@router.get("/my")
async def my_requests(current_user: dict = Depends(get_current_user)):
    if current_user["role"] not in ["passenger", "both"]:
        raise HTTPException(status_code=403, detail="Only passengers can view requests")

    cursor = db.ride_requests.find(
        {"passenger_id": current_user["id"]}
    )

    results = []

    async for req in cursor:
        ride = await db.rides.find_one({"_id": ObjectId(req["ride_id"])})
        if not ride:
            continue

        results.append({
            "id": str(req["_id"]),
            "status": req["status"],
            "from_text": ride["from_text"],
            "to_text": ride["to_text"],
            "date": ride["date"],
            "time": ride["time"],
            "ride_status": ride["status"]
        })

    return results



@router.get("/ride/{ride_id}")
async def get_ride_requests(
    ride_id: str,
    current_user: dict = Depends(get_current_user)
):
    ride = await db.rides.find_one({"_id": ObjectId(ride_id)})
    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    if ride["driver_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    

    if ride["status"] in ["open", "full"] and ride["date"].date() < date.today():
        await db.rides.update_one(
            {"_id": ride["_id"]},
            {"$set": {"status": "completed"}}
        )

    cursor = db.ride_requests.find({"ride_id": ride_id})
    requests = [sanitize_doc(r) for r in await cursor.to_list(100)]

    for r in requests:
        r["id"] = r.pop("_id")

    return requests



@router.post("/{request_id}/accept")
async def accept_request(
    request_id: str,
    current_user: dict = Depends(get_current_user)
):
    # validate request ID format
    try:
        rid = ObjectId(request_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid request ID format")

    # fetch the request document
    req = await db.ride_requests.find_one({"_id": rid})
    if not req:
        raise HTTPException(status_code=404, detail="Ride request not found")

    # fetch the ride
    try:
        ride = await db.rides.find_one({"_id": ObjectId(req["ride_id"])})
    except:
        raise HTTPException(status_code=400, detail="Invalid ride_id in request")

    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    
    if ride['status']!='open':
        raise HTTPException(status_code=400, detail=f"Cannot accept requests for a ride with status '{ride['status']}'")

    # only the owner of the ride can accept
    if ride["driver_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Only the ride owner can accept requests")
    
    if req['status']!="pending":
        raise HTTPException(status_code=400, detail=f"Cannot accept a request with status '{req['status']}'")

    # check seat availability
    if ride["seats_available"] <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    # update request status
    await db.ride_requests.update_one(
        {"_id": rid},
        {"$set": {"status": "accepted"}}
    )

    # decrement ride seat
    await db.rides.update_one(
        {"_id": ObjectId(req["ride_id"])},
        {"$inc": {"seats_available": -1}}
    )
    updated_ride = await db.rides.find_one({"_id":ObjectId(req["ride_id"])})

    if updated_ride["seats_available"]==0:
        await db.rides.update_one(
        {"_id": ObjectId(req["ride_id"])},
        {"$set": {"status": "full"}}
    )

    return {"message": "Request accepted"}


@router.post("/{request_id}/reject")
async def reject_request(
    request_id: str,
    current_user: dict = Depends(get_current_user)
):
    # Validate request ID format
    try:
        rid = ObjectId(request_id)
    except:
        raise HTTPException(status_code=400, detail="Invalid request ID format")

    # Fetch request
    req = await db.ride_requests.find_one({"_id": rid})
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")

    # Fetch ride
    try:
        ride = await db.rides.find_one({"_id": ObjectId(req["ride_id"])})
    except:
        raise HTTPException(status_code=400, detail="Invalid ride_id in request")

    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")
    

    if req['status']!="pending":
        raise HTTPException(status_code=400, detail=f"Cannot reject a request with status '{req['status']}'")
    
    # Only the ride owner can reject
    if ride["driver_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Only the ride owner can reject requests")

    # Update status to rejected
    await db.ride_requests.update_one(
        {"_id": rid},
        {"$set": {"status": "rejected"}}
    )

    return {"message": "Request rejected"}

