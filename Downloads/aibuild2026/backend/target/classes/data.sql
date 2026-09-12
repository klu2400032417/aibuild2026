-- Clear old data safely using DML Delete
DELETE FROM inventory;

-- Insert multi-location inventory (Central Warehouse vs Stores)
INSERT INTO inventory (id, product_name, sku, location, current_stock, safety_stock, lead_time_days, unit_cost, holding_cost, max_capacity) VALUES 
(1, 'Laptop', 'SKU-LAPTOP-WH', 'Central Warehouse', 500.0, 100, 2, 400.0, 10.0, 1000.0),
(2, 'Laptop', 'SKU-LAPTOP-MUM', 'Mumbai Store', 12.0, 30, 6, 450.0, 25.0, 100.0),
(3, 'Laptop', 'SKU-LAPTOP-DEL', 'Delhi Store', 8.0, 25, 7, 450.0, 25.0, 100.0),

(4, 'Milk (1 Gallon)', 'SKU-MILK-WH', 'Central Warehouse', 1200.0, 200, 1, 2.00, 0.20, 2000.0),
(5, 'Milk (1 Gallon)', 'SKU-MILK-MUM', 'Mumbai Store', 90.0, 250, 4, 2.50, 0.50, 500.0),
(6, 'Milk (1 Gallon)', 'SKU-MILK-DEL', 'Delhi Store', 75.0, 200, 5, 2.50, 0.50, 500.0),

(7, 'Computer Monitor', 'SKU-MONITOR-WH', 'Central Warehouse', 200.0, 50, 2, 130.0, 5.0, 500.0),
(8, 'Computer Monitor', 'SKU-MONITOR-MUM', 'Mumbai Store', 15.0, 35, 6, 150.0, 12.0, 80.0),

(9, 'Smart Watch', 'SKU-WATCH-WH', 'Central Warehouse', 250.0, 60, 2, 100.0, 4.0, 600.0),
(10, 'Smart Watch', 'SKU-WATCH-MUM', 'Mumbai Store', 18.0, 40, 5, 120.0, 10.0, 100.0);