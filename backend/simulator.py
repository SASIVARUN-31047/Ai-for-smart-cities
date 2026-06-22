import asyncio
import random
import datetime
import crud
import models
from database import SessionLocal, engine

# Init DB
models.Base.metadata.create_all(bind=engine)

def init_db():
    db = SessionLocal()
    zones = ["Downtown", "Suburb", "Industrial", "Commercial", "Residential"]
    if not crud.get_zones(db):
        for name in zones:
            crud.create_zone(db, name, f"{name} Zone")
    db.close()

import time
last_tick_time = 0

def generate_simulated_tick(db):
    global last_tick_time
    current_time = time.time()
    if current_time - last_tick_time < 15:
        return
    last_tick_time = current_time

    zones = crud.get_zones(db)
    
    for zone in zones:
        hour = datetime.datetime.now().hour
        
        # Base logic to make it look realistic
        is_rush_hour = hour in [8, 9, 17, 18]
        multiplier = 1.5 if is_rush_hour else 1.0
        
        traffic_speed = random.uniform(10, 60) if is_rush_hour else random.uniform(30, 80)
        vehicle_count = int(random.uniform(50, 200) * multiplier)
        
        # Industrial produces more pollution
        pollution_base = 50 if zone.name == "Industrial" else 20
        pollution_level = pollution_base + (vehicle_count * 0.2) + random.uniform(-10, 10)
        
        energy_base = 100 if zone.name in ["Industrial", "Commercial"] else 40
        energy_consumption = energy_base + (vehicle_count * 0.1) + random.uniform(-5, 5)
        
        waste_level = random.uniform(10, 95) # Goes up and down randomly for simulation
        temp = random.uniform(20, 35)
        humidity = random.uniform(30, 80)
        
        data = {
            "zone_id": zone.id,
            "vehicle_count": vehicle_count,
            "traffic_speed": traffic_speed,
            "pollution_level": max(0, pollution_level),
            "energy_consumption": max(0, energy_consumption),
            "waste_level": waste_level,
            "temperature": temp,
            "humidity": humidity
        }
        
        crud.add_sensor_data(db, data)
        


        db.close()
        await asyncio.sleep(15) # Generate data every 15 seconds
