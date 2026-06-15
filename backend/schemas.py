from pydantic import BaseModel
from typing import Optional

class SensorDataCreate(BaseModel):
    zone_id: int
    vehicle_count: int
    traffic_speed: float
    pollution_level: float
    energy_consumption: float
    waste_level: float
    temperature: float
    humidity: float
