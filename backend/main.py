from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from contextlib import asynccontextmanager
import asyncio

import database
import crud
import models
import schemas
from simulator import generate_simulated_tick, init_db
from ai_engine import init_ai_models, predict_congestion, predict_pollution_risk, forecast_energy, predict_waste_risk

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup Events
    init_db()
    init_ai_models()
    yield

app = FastAPI(title="Smart City Dashboard API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Smart City API is running"}

@app.get("/api/v1/dashboard/live")
def get_live_dashboard(db: Session = Depends(database.get_db)):
    generate_simulated_tick(db)
    # Get latest reading for each zone
    zones = crud.get_zones(db)
    live_data = []

    # Run predictions on latest data to populate AI fields
    for z in zones:
        latest_record_list = crud.get_sensor_data_by_zone(db, z.id, limit=1)
        if latest_record_list:
            r = latest_record_list[0]

            # Predict
            congestion = predict_congestion(r.vehicle_count, r.traffic_speed)
            pollution_risk = predict_pollution_risk(r.pollution_level, r.vehicle_count)
            forecasted_energy = forecast_energy(r.energy_consumption, r.temperature)
            waste_risk = predict_waste_risk(r.waste_level)

            live_data.append({
                "zone_id": z.id,
                "zone_name": z.name,
                "timestamp": r.timestamp,
                "vehicle_count": r.vehicle_count,
                "traffic_speed": r.traffic_speed,
                "pollution_level": r.pollution_level,
                "energy_consumption": r.energy_consumption,
                "waste_level": r.waste_level,
                "temperature": r.temperature,
                "humidity": r.humidity,
                # AI Predictions included
                "predicted_congestion": congestion,
                "predicted_pollution_risk": pollution_risk,
                "predicted_energy_demand": forecasted_energy,
                "predicted_waste_risk": waste_risk
            })
    return live_data

@app.get("/api/v1/dashboard/history")
def get_dashboard_history(db: Session = Depends(database.get_db), limit: int = 50):
    # Fetch chronological history per zone (grouped together for frontend chart)
    zones = crud.get_zones(db)
    history = []
    for z in zones:
        records = crud.get_sensor_data_by_zone(db, z.id, limit=limit)
        # Reverse to be chronological for charts
        records.reverse()
        history.append({
            "zone_id": z.id,
            "zone_name": z.name,
            "data": [
                {
                    "time": str(r.timestamp.strftime("%H:%M:%S")),
                    "vehicle_count": r.vehicle_count,
                    "pollution_level": r.pollution_level,
                    "energy_consumption": r.energy_consumption,
                    "traffic_speed": r.traffic_speed,
                    "waste_level": r.waste_level
                } for r in records
            ]
        })
    return history

@app.get("/api/v1/recommendations")
def get_recommendations(db: Session = Depends(database.get_db)):
    # Decision Engine based on latest data
    zones = crud.get_zones(db)
    recommendations = []

    for z in zones:
        latest_record_list = crud.get_sensor_data_by_zone(db, z.id, limit=1)
        if latest_record_list:
            r = latest_record_list[0]

            congestion = predict_congestion(r.vehicle_count, r.traffic_speed)
            pollution_risk = predict_pollution_risk(r.pollution_level, r.vehicle_count)
            waste_risk = predict_waste_risk(r.waste_level)

            if congestion > 0.7:
                recommendations.append(f"Congestion High in {z.name}: Suggested to increase green signal time by 15s and route traffic via alternate zones.")
            if pollution_risk == "High":
                recommendations.append(f"CRITICAL Pollution Alert in {z.name} (Risk: High). Recommend citizens to stay indoors and detour heavy vehicles.")
            if waste_risk == "High Risk":
                recommendations.append(f"Waste Overflow Risk in {z.name}: Schedule immediate municipal garbage collection.")

    return recommendations
