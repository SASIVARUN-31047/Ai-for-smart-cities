from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
import datetime

class Zone(Base):
    __tablename__ = "zones"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(String)

class SensorData(Base):
    __tablename__ = "sensor_data"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    
    vehicle_count = Column(Integer)
    traffic_speed = Column(Float)
    pollution_level = Column(Float) # AQI
    energy_consumption = Column(Float) # MW
    waste_level = Column(Float) # Percentage
    temperature = Column(Float) # Celsius
    humidity = Column(Float) # Percentage

class PredictionLog(Base):
    __tablename__ = "prediction_logs"
    id = Column(Integer, primary_key=True, index=True)
    zone_id = Column(Integer, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    
    congestion_index = Column(Float)
    pollution_risk = Column(String) # Low, Medium, High
    predicted_energy = Column(Float)
    waste_overflow_risk = Column(Float) # Probability
