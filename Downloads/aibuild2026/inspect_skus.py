import pandas as pd

df = pd.read_csv("supply_chain_dataset1.csv")

# Get unique SKUs
unique_skus = df['SKU_ID'].unique()
print(f"Number of unique SKUs: {len(unique_skus)}")
print("Sample of SKUs:", list(unique_skus[:10]))

# Aggregate average values for each SKU to pre-populate database catalog
sku_summary = df.groupby('SKU_ID').agg({
    'Inventory_Level': 'mean',
    'Supplier_Lead_Time_Days': 'mean',
    'Unit_Cost': 'mean',
    'Unit_Price': 'mean',
    'Order_Quantity': 'mean'
}).reset_index()

print("\nSKU Aggregated Summary (First 5):")
print(sku_summary.head(5))
