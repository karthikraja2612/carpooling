from pydantic import BaseModel

class RideRequestCreate(BaseModel):
    passenger_id: str
