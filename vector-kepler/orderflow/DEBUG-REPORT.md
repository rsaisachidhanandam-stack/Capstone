# DEBUG-REPORT.md

## Bug 1: Orphaned Records (Constraint Violation)

### Move 1: Reproduce the Symptom
We suspect there are orders that do not belong to any valid customer.

**Reproduction Query:**
```sql
SELECT o.id, o.customer_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
WHERE c.id IS NULL;
```

**Result:**
| id | customer_id |
|----|-------------|
| 1  | 999         |

### Move 2: Trace the Data Flow
1. An order was inserted with `customer_id = 999`.
2. The `orders` table does not have a `FOREIGN KEY` constraint on `customer_id`.
3. The system allowed this write even though no customer with ID 999 exists.

### Move 3: Identify the Root Cause
**Root Cause:** The `orders` table is missing a `FOREIGN KEY` constraint on `customer_id` and a `NOT NULL` constraint. This allowed invalid references to enter the database.

### Move 4: Propose and Apply the Fix
**Fix Applied:**
```sql
-- Remove bad data first
DELETE FROM orders WHERE id IN (
    SELECT o.id FROM orders o LEFT JOIN customers c ON o.customer_id = c.id WHERE c.id IS NULL
);

-- Add Foreign Key and Not Null
ALTER TABLE orders ADD CONSTRAINT fk_orders_customer FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE orders ALTER COLUMN customer_id SET NOT NULL;
```

### Move 5: Validate the Fix
**Validation Query (Reproduce):**
```sql
SELECT o.id, o.customer_id
FROM orders o
LEFT JOIN customers c ON o.customer_id = c.id
WHERE c.id IS NULL;
```
*Result: Empty set (0 rows).*

**Attempted Bad Insert:**
```sql
INSERT INTO orders (customer_id, status) VALUES (999, 'pending');
```
*Result: Error: FOREIGN KEY constraint failed.*

---

## Bug 2: Status Inconsistency (Data Inconsistency)

### Move 1: Reproduce the Symptom
We suspect some orders are marked as 'pending' even though the payment is 'completed'.

**Reproduction Query:**
```sql
SELECT o.id, o.status as order_status, p.status as payment_status
FROM orders o
JOIN payments p ON p.order_id = o.id
WHERE o.status = 'pending' AND p.status = 'completed';
```

**Result:**
| id | order_status | payment_status |
|----|--------------|----------------|
| 2  | pending      | completed      |

### Move 2: Trace the Data Flow
1. Order #2 was created with status 'pending'.
2. A payment for Order #2 was recorded and marked as 'completed'.
3. There is no logic or constraint at the database level to ensure that an order's status synchronizes with its payment status.

### Move 3: Identify the Root Cause
**Root Cause:** Lack of data integrity enforcement between the `orders` and `payments` tables. While application logic should handle this, a `CHECK` constraint or a more robust status state machine at the schema level is missing to prevent this drift.

### Move 4: Propose and Apply the Fix
**Fix Applied:**
```sql
ALTER TABLE orders ADD CONSTRAINT check_status CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'));
ALTER TABLE payments ADD CONSTRAINT check_pay_status CHECK (status IN ('pending', 'completed', 'failed'));
```

### Move 5: Validate the Fix
**Attempted Bad Insert (Invalid Status):**
```sql
UPDATE orders SET status = 'shipped_wrongly' WHERE id = 2;
```
*Result: Error: CHECK constraint failed: check_status.*

---

## Bug 3: Inventory Integrity (Constraint Violation)

### Move 1: Reproduce the Symptom
We suspect there are products with negative stock and order items with missing quantities.

**Reproduction Query 1 (Negative Stock):**
```sql
SELECT id, name, stock FROM products WHERE stock < 0;
```

**Result:**
| id | name         | stock |
|----|--------------|-------|
| 3  | Broken Phone | -5    |

**Reproduction Query 2 (NULL Quantity):**
```sql
SELECT id, order_id, product_id, quantity FROM order_items WHERE quantity IS NULL;
```

**Result:**
| id | order_id | product_id | quantity |
|----|----------|------------|----------|
| 1  | 2        | 1          | NULL     |

### Move 2: Trace the Data Flow
1. A product was inserted/updated with a negative stock value.
2. An order item was created with a NULL quantity.
3. The schema allowed these values because `stock` lacks a `CHECK` constraint and `quantity` is not marked `NOT NULL`.

### Move 3: Identify the Root Cause
**Root Cause:** Missing `CHECK (stock >= 0)` on the `products.stock` column and missing `NOT NULL` / `CHECK (quantity > 0)` on `order_items.quantity`.

### Move 4: Propose and Apply the Fix
**Fix Applied:**
```sql
UPDATE products SET stock = 0 WHERE stock < 0;
ALTER TABLE products ADD CONSTRAINT chk_stock_positive CHECK (stock >= 0);

UPDATE order_items SET quantity = 1 WHERE quantity IS NULL;
ALTER TABLE order_items ALTER COLUMN quantity SET NOT NULL;
ALTER TABLE order_items ADD CONSTRAINT chk_quantity_positive CHECK (quantity > 0);
```

### Move 5: Validate the Fix
**Validation Query (Negative Stock):**
```sql
SELECT id FROM products WHERE stock < 0;
```
*Result: Empty set.*

**Attempted Bad Update:**
```sql
UPDATE products SET stock = -10 WHERE id = 1;
```
*Result: Error: CHECK constraint failed: chk_stock_positive.*

## Move 6: Final Documentation Trail
All three production bugs have been traced and resolved at the schema level. Applying these constraints ensures that invalid data can never enter the system again, regardless of application-layer errors.
