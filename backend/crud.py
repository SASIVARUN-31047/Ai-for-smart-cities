from sqlalchemy.orm import Session
import models
import datetime

def get_zones(db: Session):
    return db.query(models.Zone).all()

def create_zone(db: Session, name: str, description: str):
    db_zone = models.Zone(name=name, description=description)
    db.add(db_zone)
    db.commit()
    db.refresh(db_zone)
    return db_zone

def add_sensor_data(db: Session, data: dict):
    db_data = models.SensorData(**data)
    db.add(db_data)
    db.commit()
    db.refresh(db_data)
    return db_data

def get_latest_sensor_data(db: Session, limit: int = 100):
    return db.query(models.SensorData).order_by(models.SensorData.timestamp.desc()).limit(limit).all()

def get_sensor_data_by_zone(db: Session, zone_id: int, limit: int = 100):
    return db.query(models.SensorData).filter(models.SensorData.zone_id == zone_id).order_by(models.SensorData.timestamp.desc()).limit(limit).all()

def add_prediction_log(db: Session, prediction: dict):
    db_pred = models.PredictionLog(**prediction)
    db.add(db_pred)
    db.commit()
    db.refresh(db_pred)
    return db_pred
    
def get_latest_predictions(db: Session, limit: int = 50):
    return db.query(models.PredictionLog).order_by(models.PredictionLog.timestamp.desc()).limit(limit).all()
