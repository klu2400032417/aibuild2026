import pandas as pd

def inspect_file(filepath):
    print("=" * 60)
    print(f"Inspecting file: {filepath}")
    print("=" * 60)
    try:
        # Load first 5 rows to quickly see format
        df_head = pd.read_csv(filepath, nrows=5)
        print("Columns:")
        print(list(df_head.columns))
        print("\nFirst 3 rows:")
        print(df_head.head(3))
        
        # Get shape and null info
        df_info = pd.read_csv(filepath, usecols=[df_head.columns[0]]) # Load single col to get row count quickly
        print(f"\nTotal rows: {len(df_info)}")
    except Exception as e:
        print(f"Error inspecting {filepath}: {str(e)}")
    print("\n")

inspect_file("store_sales_data.csv")
inspect_file("supply_chain_dataset1.csv")
