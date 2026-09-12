import pandas as pd
import numpy as np

def clean_sales_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans raw sales historical data.
    """
    if df.empty:
        return df
    
    # Handle missing values
    df = df.copy()
    if 'historical_sales' in df.columns:
        df['historical_sales'] = df['historical_sales'].fillna(df['historical_sales'].median() if not df['historical_sales'].isnull().all() else 0)
    
    if 'price' in df.columns:
        df['price'] = df['price'].fillna(df['price'].mean() if not df['price'].isnull().all() else 10.0)
        
    if 'promo_active' in df.columns:
        df['promo_active'] = df['promo_active'].fillna(0).astype(int)
        
    return df

def clean_inventory_data(df: pd.DataFrame) -> pd.DataFrame:
    """
    Cleans inventory data.
    """
    if df.empty:
        return df
    
    df = df.copy()
    if 'current_stock' in df.columns:
        df['current_stock'] = df['current_stock'].fillna(0).clip(lower=0)
        
    if 'lead_time_days' in df.columns:
        df['lead_time_days'] = df['lead_time_days'].fillna(7).astype(int)
        
    if 'safety_stock' in df.columns:
        df['safety_stock'] = df['safety_stock'].fillna(10).astype(int)
        
    return df
