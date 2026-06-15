import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestClassifier

# Global Models
traffic_model = LinearRegression()
pollution_model = RandomForestClassifier(n_estimators=10, random_state=42)
energy_model = LinearRegression()
waste_model = RandomForestClassifier(n_estimators=10, random_state=42)

def init_ai_models():
    print("Initializing and training AI models with synthetic historical data...")
    # Traffic Model (Congestion index)
    # Target: congestion (0.0 to 1.0)
    # Features: [vehicle_count, speed]
    # High count + Low speed = High congestion
    np.random.seed(42)
    X_traffic = np.random.rand(100, 2)
    X_traffic[:, 0] = X_traffic[:, 0] * 500 # vehicle_count up to 500
    X_traffic[:, 1] = X_traffic[:, 1] * 100 # speed up to 100
    # synthetic label
    y_traffic = (X_traffic[:, 0] / 500) * 0.7 + ((100 - X_traffic[:, 1]) / 100) * 0.3
    traffic_model.fit(X_traffic, y_traffic)

    # Pollution Model
    # Target: 'Low', 'Medium', 'High'
    # Features: [pollution_level, traffic_density]
    X_poll = np.random.rand(100, 2)
    X_poll[:, 0] = X_poll[:, 0] * 200 # pollution up to 200
    X_poll[:, 1] = X_poll[:, 1] * 500 # traffic density up to 500
    y_poll = []
    for row in X_poll:
        if row[0] > 100 and row[1] > 200:
            y_poll.append("High")
        elif row[0] > 50:
            y_poll.append("Medium")
        else:
            y_poll.append("Low")
    pollution_model.fit(X_poll, y_poll)

    # Energy Model
    # Target: predicted_energy MW
    # Features: [energy_consumption, temperature]
    X_energy = np.random.rand(100, 2)
    X_energy[:, 0] = X_energy[:, 0] * 200
    X_energy[:, 1] = X_energy[:, 1] * 40 # temps up to 40C
    # More heat -> more energy for AC
    y_energy = X_energy[:, 0] * 1.05 + (X_energy[:, 1] * 0.5)
    energy_model.fit(X_energy, y_energy)

    # Waste Overflow Model
    # Target: probability of overflow index 0.0 to 1.0 -> but Random Forest gives class or proba
    # We will just predict 'Low Risk', 'High Risk'
    # Features: [waste_level]
    X_waste = np.random.rand(100, 1) * 100
    y_waste = ["High Risk" if x > 80 else "Low Risk" for x in X_waste]
    waste_model.fit(X_waste, y_waste)
    print("AI Models Trained.")

def predict_congestion(vehicle_count, speed):
    X = np.array([[vehicle_count, speed]])
    pred = traffic_model.predict(X)[0]
    return max(0.0, min(1.0, float(pred)))

def predict_pollution_risk(pollution_level, vehicle_count):
    X = np.array([[pollution_level, vehicle_count]])
    return pollution_model.predict(X)[0]

def forecast_energy(current_consumption, temperature):
    X = np.array([[current_consumption, temperature]])
    pred = energy_model.predict(X)[0]
    return float(pred)

def predict_waste_risk(waste_level):
    X = np.array([[waste_level]])
    return waste_model.predict(X)[0]
