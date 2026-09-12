import os
import joblib
import numpy as np
from sklearn.linear_model import LinearRegression

# Ensure models directory exists
os.makedirs("models", exist_ok=True)

# 1. Demand Forecasting Model (Linear Regression)
# Predicts demand based on features: historical_sales, season_index, price, promo_active
X_demand = np.array([
    [100, 1, 10.0, 0],
    [150, 2, 9.5, 1],
    [120, 3, 10.0, 0],
    [180, 4, 9.0, 1],
    [110, 1, 10.5, 0],
    [160, 2, 9.5, 1],
    [130, 3, 10.0, 0],
    [190, 4, 9.0, 1]
])
y_demand = np.array([105, 155, 125, 185, 112, 163, 134, 192])

demand_model = LinearRegression()
demand_model.fit(X_demand, y_demand)
joblib.dump(demand_model, "models/demand_forecasting.pkl")
print("Demand forecasting model saved successfully!")

# 2. Inventory Optimization Model (Linear Regression)
# Predicts recommended reorder quantity based on: current_stock, demand_forecast, lead_time_days, safety_stock
X_inv = np.array([
    [50, 100, 5, 20],
    [10, 150, 7, 30],
    [100, 120, 4, 15],
    [5, 180, 10, 40],
    [80, 110, 5, 20],
    [20, 160, 6, 25]
])
y_inv = np.array([70, 170, 35, 215, 50, 165])

inv_model = LinearRegression()
inv_model.fit(X_inv, y_inv)
joblib.dump(inv_model, "models/inventory_model.pkl")
print("Inventory model saved successfully!")
