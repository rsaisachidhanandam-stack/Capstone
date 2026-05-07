-- MOVE 4: Fixes for Production Database Failures

-- Fix Bug 1: Orphaned Records
-- We first need to clean up the bad data before adding the constraint
DELETE FROM orders WHERE id IN (
    SELECT o.id FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE c.id IS NULL
);

-- Apply constraints (Using SQLite's limited ALTER TABLE or recreating if necessary)
-- For the sake of the exercise, we'll write standard SQL
ALTER TABLE orders ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE orders MODIFY customer_id INTEGER NOT NULL;

-- Fix Bug 2: Status Inconsistency
-- Ensure status values are valid
ALTER TABLE orders ADD CONSTRAINT chk_order_status CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'));
ALTER TABLE payments ADD CONSTRAINT chk_payment_status CHECK (status IN ('pending', 'completed', 'failed'));

-- Fix Bug 3: Inventory Integrity
-- Clean up negative stock
UPDATE products SET stock = 0 WHERE stock < 0;
ALTER TABLE products ADD CONSTRAINT chk_stock_positive CHECK (stock >= 0);

-- Clean up NULL quantities
UPDATE order_items SET quantity = 1 WHERE quantity IS NULL;
ALTER TABLE order_items MODIFY quantity INTEGER NOT NULL;
ALTER TABLE order_items ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0);
