import os
import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from agents.base_agent import BaseAgent
from knowledge.shared_context import SharedKnowledgeBase
from preprocessing.clean_data import clean_inventory_data
from preprocessing.feature_engineering import engineer_inventory_features

class InventoryAgent(BaseAgent):
    def __init__(self, context: SharedKnowledgeBase):
        super().__init__("InventoryAgent", context)
        self.model_path = os.path.join("models", "inventory_model.pkl")
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                self.log("INFO", "Pre-trained inventory model loaded successfully.")
            else:
                self.log("WARNING", "Inventory model pickle missing. Training fallback model...")
                X = np.array([[50, 100, 5, 20], [10, 150, 7, 30], [100, 120, 4, 15], [5, 180, 10, 40]])
                y = np.array([70, 170, 35, 215])
                self.model = LinearRegression().fit(X, y)
                os.makedirs("models", exist_ok=True)
                joblib.dump(self.model, self.model_path)
        except Exception as e:
            self.log("ERROR", f"Failed to load or train inventory model: {str(e)}")
            self.model = None

    def run(self, data: dict):
        self.log("INFO", "Assessing inventory levels.")
        
        demand_forecast = self.context.get("demand", "forecast", 100.0)
        current_stock = float(data.get("current_stock", 50.0))
        lead_time_days = int(data.get("lead_time_days", 5))
        safety_stock = int(data.get("safety_stock", 20))

        import pandas as pd
        raw_df = pd.DataFrame([{
            "current_stock": current_stock,
            "demand_forecast": demand_forecast,
            "lead_time_days": lead_time_days,
            "safety_stock": safety_stock
        }])
        
        cleaned_df = clean_inventory_data(raw_df)
        X = engineer_inventory_features(cleaned_df)

        if self.model:
            recommended_reorder = float(self.model.predict(X)[0])
        else:
            # Fallback simple formula: Demand + Safety - Stock
            recommended_reorder = demand_forecast + safety_stock - current_stock
            
        # Business Self-Check Override (Enforces Business Goals):
        # If stock is below safety limit but ML predicts <= 0, force reorder to cover the deficit.
        if current_stock < safety_stock and recommended_reorder <= 0.0:
            recommended_reorder = demand_forecast + safety_stock - current_stock

        recommended_reorder = max(0.0, round(recommended_reorder, 2))
        inventory_gap = max(0.0, demand_forecast + safety_stock - current_stock)

        # Enforce source surplus constraints (taking from where there is unused stock)
        source_location = data.get("source_location", "Central Warehouse")
        source_surplus = float(data.get("source_surplus", 9999.0))
        
        # If it is a Warehouse itself, we do not need a transfer!
        location = data.get("location", "Store")
        if "warehouse" in location.lower():
            recommended_reorder = 0.0
            inventory_gap = 0.0
            self.log("SUCCESS", f"Location is {location} (Source Hub). No transfer required.")
        elif recommended_reorder > source_surplus:
            self.log("WARNING", f"Unused stock at source ({source_location}) is only {source_surplus} units. Capping transfer request of {recommended_reorder} units to match available surplus.")
            recommended_reorder = source_surplus

        self.context.set("inventory", "current_stock", current_stock)
        self.context.set("inventory", "safety_stock", safety_stock)
        self.context.set("inventory", "inventory_gap", inventory_gap)
        self.context.set("inventory", "recommended_reorder", recommended_reorder)
        self.context.set("inventory", "location", location)
        self.context.set("inventory", "source_location", source_location)
        self.context.set("inventory", "source_surplus", source_surplus)
            
        return recommended_reorder
