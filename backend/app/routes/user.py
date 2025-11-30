from fastapi import APIRouter, HTTPException, Depends
from app.utils.deps import get_current_user
from app.database import db
from app.utils.serializers import sanitize_doc
from bson import ObjectId

router = APIRouter(prefix="/users")


@router.get("/me/rides-created")
async def get_rides_created(current_user: dict = Depends(get_current_user)):
    cursor = db.rides.find({"driver_id": current_user['id']})
    rides = [sanitize_doc(r) for r in await cursor.to_list(100)]
    
    for r in rides:
        r["id"] = r.pop("_id")
    return rides


@router.get("/me/rides-joined")
async def get_rides_joined(user_id: str):
    # find accepted requests by passenger
    request_cursor = db.ride_requests.find({
        "passenger_id": user_id,
        "status": "accepted"
    })

    requests = await request_cursor.to_list(100)
    
    ride_ids = [ObjectId(r["ride_id"]) for r in requests]

    if not ride_ids:
        return []  # no bookings

    # fetch all rides with matching ride_ids
    ride_cursor = db.rides.find({"_id": {"$in": ride_ids}})
    rides = [sanitize_doc(r) for r in await ride_cursor.to_list(100)]

    for r in rides:
        r["id"] = r.pop("_id")

    return rides
