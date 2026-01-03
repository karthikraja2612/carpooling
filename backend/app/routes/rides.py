from fastapi import APIRouter, HTTPException, Depends
from app.utils.deps import get_current_user
from app.database import db
from app.models.ride import RideCreate
from app.utils.serializers import sanitize_doc
from bson import ObjectId
from datetime import datetime, date

router = APIRouter(prefix="/rides")


@router.post("/")
async def create_ride(
    ride: RideCreate,
    current_user: dict = Depends(get_current_user)
):

    if current_user["role"] not in ["driver", "both"]:
        raise HTTPException(status_code=403, detail="Only drivers can create rides")
    
    if ride.seats_total<=0:
        raise HTTPException(status_code=400, detail="seats total must be greater than 0")
    
    if ride.date < date.today():
        raise HTTPException(status_code=400, detail="Ride date must be today or in the future")

    new_ride = {
        "driver_id": current_user["id"],   # <-- auto from token
        "from_text": ride.from_text,
        "to_text": ride.to_text,
        "from_lat": ride.from_lat,
        "from_lng": ride.from_lng,
        "to_lat": ride.to_lat,
        "to_lng": ride.to_lng,
        "date": ride.date,
        "time": ride.time,
        "seats_total": ride.seats_total,
        "seats_available": ride.seats_total,
        "price_per_seat": ride.price_per_seat,
        "status": "open",
        "created_at": datetime.utcnow()
    }


    result = await db.rides.insert_one(new_ride)
    created = await db.rides.find_one({"_id": result.inserted_id})

    created = sanitize_doc(created)
    created["id"] = created.pop("_id")
    return created


@router.get("/")
async def search_rides(from_text: str = None, to_text: str = None, date: str = None):
    query = {}

    if from_text:
        query["from_text"] = {"$regex": from_text, "$options": "i"}
    if to_text:
        query["to_text"] = {"$regex": to_text, "$options": "i"}
    if date:
        query["date"] = date

    rides_cursor = db.rides.find(query)
    rides = [sanitize_doc(r) for r in await rides_cursor.to_list(200)]

    for r in rides:
        r["id"] = r.pop("_id")

    return rides


@router.get("/{ride_id}")
async def get_single_ride(ride_id: str):
    try:
        ride = await db.rides.find_one({"_id": ObjectId(ride_id)})
    except:
        raise HTTPException(status_code=400, detail="Invalid ride ID format")

    if not ride:
        raise HTTPException(status_code=404, detail="Ride not found")

    ride = sanitize_doc(ride)
    ride["id"] = ride.pop("_id")
    return ride
