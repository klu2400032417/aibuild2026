import pandas as pd
import numpy as np

def engineer_demand_features(df: pd.DataFrame) -> np.ndarray:
    """
    Transforms raw dataframe into the feature matrix for demand forecasting model.
    Expected columns: historical_sales, season_index, price, promo_active
    """
    features = ['historical_sales', 'season_index', 'price', 'promo_active']
    for col in features:
        if col not in df.columns:
            if col == 'season_index':
                df[col] = 1
            elif col == 'price':
                df[col] = 10.0
            elif col == 'promo_active':
                df[col] = 0
            else:
                df[col] = 0.0
                
    return df[features].to_numpy()

def engineer_inventory_features(df: pd.DataFrame) -> np.ndarray:
    """
    Transforms dataframe into the feature matrix for inventory reorder model.
    Expected columns: current_stock, demand_forecast, lead_time_days, safety_stock
    """
    features = ['current_stock', 'demand_forecast', 'lead_time_days', 'safety_stock']
    for col in features:
        if col not in df.columns:
            if col == 'lead_time_days':
                df[col] = 5
            elif col == 'safety_stock':
                df[col] = 20
            elif col == 'demand_forecast':
                df[col] = 100.0
            else:
                df[col] = 0.0
                
    return df[features].to_numpy()
