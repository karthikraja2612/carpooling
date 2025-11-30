from fastapi import APIRouter, HTTPException, Depends
from app.utils.deps import get_current_user
from app.database import db
from app.models.request import RideRequestCreate
from app.utils.serializers import sanitize_doc
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/requests")

@router.post("/ride/{ride_id}")
async def request_seat(
    ride_id: str,
    current_user: dict = Depends(get_current_user)
):
    # only passengers allowed
    if current_user["role"] not in ["passenger", "both"]:
        raise HTTPException(status_code=403, detail="Only passengers can request seats")
    try:
        ride = await db.rides.find_one({"_id": ObjectId(ride_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid ride ID")

    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    if ride["seats_available"] <= 0:
        raise HTTPException(status_code=400, detail="Ride is already full")

    new_request = {
        "ride_id": ride_id,
        "passenger_id": current_user["id"],   # <-- auto
        "status": "pending",
        "created_at": datetime.utcnow()
    }


    result = await db.ride_requests.insert_one(new_request)
    created = await db.ride_requests.find_one({"_id": result.inserted_id})

    created = sanitize_doc(created)
    created["id"] = created.pop("_id")

    return created


@router.get("/ride/{ride_id}")
async def get_ride_requests(ride_id: str):
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

    # only the owner of the ride can accept
    if ride["driver_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Only the ride owner can accept requests")

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

    # Only the ride owner can reject
    if ride["driver_id"] != current_user["id"]:
        raise HTTPException(status_code=403, detail="Only the ride owner can reject requests")

    # Update status to rejected
    await db.ride_requests.update_one(
        {"_id": rid},
        {"$set": {"status": "rejected"}}
    )

    return {"message": "Request rejected"}

