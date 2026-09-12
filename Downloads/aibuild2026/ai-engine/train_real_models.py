import os
import joblib
import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression

# Path settings
root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
supply_chain_path = os.path.join(root_dir, "supply_chain_dataset1.csv")
store_sales_path = os.path.join(root_dir, "store_sales_data.csv")
models_dir = os.path.join(root_dir, "ai-engine", "models")
backend_resources_dir = os.path.join(root_dir, "backend", "resources")

os.makedirs(models_dir, exist_ok=True)

print("Loading supply chain dataset...")
df_sc = pd.read_csv(supply_chain_path)
df_sc['Date'] = pd.to_datetime(df_sc['Date'])
df_sc['Month'] = df_sc['Date'].dt.month

# 1. Train Demand Forecasting Model
# Features: historical_sales (Units_Sold), season_index (Month), price (Unit_Price), promo_active (Promotion_Flag)
# Target: Demand_Forecast
print("Training Demand Forecasting Model...")
X_demand = df_sc[['Units_Sold', 'Month', 'Unit_Price', 'Promotion_Flag']].to_numpy()
y_demand = df_sc['Demand_Forecast'].to_numpy()

demand_model = LinearRegression()
demand_model.fit(X_demand, y_demand)
joblib.dump(demand_model, os.path.join(models_dir, "demand_forecasting.pkl"))
print("Demand forecasting model trained and saved successfully.")

# 2. Train Inventory Optimization Model
# Features: current_stock (Inventory_Level), demand_forecast (Demand_Forecast), lead_time_days (Supplier_Lead_Time_Days), safety_stock (20 as default)
# Target: Order_Quantity
print("Training Inventory Optimization Model...")
df_sc['Safety_Stock'] = 20 # Add dummy safety stock column
X_inv = df_sc[['Inventory_Level', 'Demand_Forecast', 'Supplier_Lead_Time_Days', 'Safety_Stock']].to_numpy()
y_inv = df_sc['Order_Quantity'].to_numpy()

inv_model = LinearRegression()
inv_model.fit(X_inv, y_inv)
joblib.dump(inv_model, os.path.join(models_dir, "inventory_model.pkl"))
print("Inventory model trained and saved successfully.")

# Get 50 unique product names (Using simple, well-known consumer products)
product_names = [
    "Office Laptop", "Wireless Earbuds", "Mechanical Keyboard", "LED Computer Monitor",
    "Gaming Smartphone", "Bluetooth Speaker", "Smart Watch", "Tablet Pro", "Laser Printer",
    "USB-C Hub", "External Hard Drive", "Webcam 1080p", "Desk Lamp", "Gaming Mouse",
    "Power Bank", "Wi-Fi Router", "Noise Cancelling Headphones", "Mini Projector",
    "Virtual Reality Headset", "Microphone Stand", "Ergonomic Desk Chair", "Dual Monitor Mount",
    "Smart Light Bulb", "Streaming Microphone", "Wireless Phone Charger", "Laptop Cooling Pad",
    "USB Flash Drive 128GB", "HDMI Cable 10ft", "Cable Organizer Sleeve", "Graphic Drawing Tablet",
    "Memory Card Reader", "Screen Cleaning Kit", "Compact Camera", "Air Purifier",
    "Smart Coffee Mug", "Portable SSD 1TB", "Home Security Camera", "Fingerprint Padlock",
    "Digital Voice Recorder", "Electric Standing Desk", "Phone Tripod Stand", "Trackball Mouse",
    "Smart Thermostat", "Mini Fridge Desk Size", "Tile Bluetooth Tracker", "Virtual Assistant Speaker",
    "Laptop Sleeve 15inch", "Paper Shredder Office", "Label Maker Printer", "Smart Scale Body Fat"
]

# Aggregate supply chain data to create catalog averages
sku_summary = df_sc.groupby('SKU_ID').agg({
    'Inventory_Level': 'mean',
    'Supplier_Lead_Time_Days': 'mean',
    'Unit_Cost': 'mean',
    'Unit_Price': 'mean',
    'Order_Quantity': 'mean'
}).reset_index()

# Sort SKUs numerically (SKU_1, SKU_2, ... SKU_50)
def extract_number(sku):
    try:
        return int(sku.split('_')[1])
    except:
        return 999
sku_summary['sku_num'] = sku_summary['SKU_ID'].apply(extract_number)
sku_summary = sku_summary.sort_values('sku_num').reset_index(drop=True)

# Build SQL statements
sql_statements = ["-- Auto-generated supply chain seeder from real dataset", "INSERT INTO inventory (id, product_name, sku, current_stock, safety_stock, lead_time_days, unit_cost, holding_cost, max_capacity) VALUES "]

insert_rows = []
for idx, row in sku_summary.iterrows():
    prod_id = idx + 1
    prod_name = product_names[idx].replace("'", "''") # Escape SQL single quotes
    sku = row['SKU_ID']
    curr_stock = round(row['Inventory_Level'], 2)
    safety_stock = int(curr_stock * 0.15) # 15% of average stock as safety stock
    lead_time = int(row['Supplier_Lead_Time_Days'])
    unit_cost = round(row['Unit_Cost'], 2)
    holding_cost = round(unit_cost * 0.05, 2) # 5% holding cost rate
    max_capacity = round(curr_stock * 1.5, 2) # Max capacity 1.5x average inventory level
    
    insert_rows.append(f"({prod_id}, '{prod_name}', '{sku}', {curr_stock}, {safety_stock}, {lead_time}, {unit_cost}, {holding_cost}, {max_capacity})")

sql_statements.append(",\n".join(insert_rows))
sql_statements.append("ON DUPLICATE KEY UPDATE \n    current_stock = VALUES(current_stock),\n    safety_stock = VALUES(safety_stock),\n    lead_time_days = VALUES(lead_time_days),\n    unit_cost = VALUES(unit_cost),\n    holding_cost = VALUES(holding_cost),\n    max_capacity = VALUES(max_capacity);")

# Write to backend/resources/data.sql
data_sql_path = os.path.join(backend_resources_dir, "data.sql")
with open(data_sql_path, "w", encoding="utf-8") as f:
    f.write("\n".join(sql_statements))

print(f"data.sql seeder generated successfully at {data_sql_path} with 50 products!")
