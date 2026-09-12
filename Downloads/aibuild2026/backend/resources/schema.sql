DROP TABLE IF EXISTS inventory;
CREATE TABLE IF NOT EXISTS inventory (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    sku VARCHAR(255) NOT NULL UNIQUE,
    location VARCHAR(255) DEFAULT 'Warehouse',
    current_stock DOUBLE DEFAULT 0.0,
    safety_stock INT DEFAULT 10,
    lead_time_days INT DEFAULT 5,
    unit_cost DOUBLE DEFAULT 10.0,
    holding_cost DOUBLE DEFAULT 1.0,
    max_capacity DOUBLE DEFAULT 100.0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
