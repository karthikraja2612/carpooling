from pydantic import BaseModel
from typing import Optional
from datetime import date

class RideCreate(BaseModel):
    from_text: str
    to_text: str
    from_lat: float
    from_lng: float
    to_lat: float
    to_lng: float
    date: date
    time: str
    seats_total: int
    price_per_seat: Optional[float] = None
