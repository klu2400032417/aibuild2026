import os
import joblib
import numpy as np
from sklearn.linear_model import LinearRegression
from agents.base_agent import BaseAgent
from knowledge.shared_context import SharedKnowledgeBase
from preprocessing.clean_data import clean_sales_data
from preprocessing.feature_engineering import engineer_demand_features

class DemandAgent(BaseAgent):
    def __init__(self, context: SharedKnowledgeBase):
        super().__init__("DemandAgent", context)
        self.model_path = os.path.join("models", "demand_forecasting.pkl")
        self._load_model()

    def _load_model(self):
        try:
            if os.path.exists(self.model_path):
                self.model = joblib.load(self.model_path)
                self.log("INFO", "Pre-trained demand model loaded successfully.")
            else:
                self.log("WARNING", "Demand model pickle missing. Training fallback model...")
                # Fallback inline training
                X = np.array([[100, 1, 10.0, 0], [150, 2, 9.5, 1], [120, 3, 10.0, 0], [180, 4, 9.0, 1]])
                y = np.array([105, 155, 125, 185])
                self.model = LinearRegression().fit(X, y)
                os.makedirs("models", exist_ok=True)
                joblib.dump(self.model, self.model_path)
        except Exception as e:
            self.log("ERROR", f"Failed to load or train demand model: {str(e)}")
            # Ultra fallback
            self.model = None

    def run(self, data: dict):
        self.log("INFO", "Starting demand forecasting analysis.")
        
        # Extract features
        hist_sales = float(data.get("historical_sales", 100.0))
        season_index = int(data.get("season_index", 1))
        price = float(data.get("price", 10.0))
        promo_active = int(data.get("promo_active", 0))

        # Build feature vector
        import pandas as pd
        raw_df = pd.DataFrame([{
            "historical_sales": hist_sales,
            "season_index": season_index,
            "price": price,
            "promo_active": promo_active
        }])
        
        cleaned_df = clean_sales_data(raw_df)
        X = engineer_demand_features(cleaned_df)

        # Predict
        if self.model:
            forecast = float(self.model.predict(X)[0])
        else:
            # Rule fallback
            forecast = hist_sales * 1.05
            
        forecast = max(0.0, round(forecast, 2))
        
        self.context.set("demand", "forecast", forecast)
        self.context.set("demand", "input_features", {
            "historical_sales": hist_sales,
            "season_index": season_index,
            "price": price,
            "promo_active": promo_active
        })
        self.log("SUCCESS", f"Demand forecast generated: {forecast} units.")
        return forecast
