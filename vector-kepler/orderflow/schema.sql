-- Initial Schema with intentional flaws

CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INTEGER DEFAULT 0 -- Missing CHECK (stock >= 0)
);

CREATE TABLE orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_id INTEGER, -- Missing FOREIGN KEY and NOT NULL
    status TEXT DEFAULT 'pending', -- Missing CHECK (status IN ('pending', 'processing', 'completed', 'cancelled'))
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER, -- Missing NOT NULL and CHECK (quantity > 0)
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    status TEXT DEFAULT 'pending', -- Missing synchronization/constraints
    amount DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
);

-- Seed Data demonstrating bugs

-- Valid Customer
INSERT INTO customers (name, email) VALUES ('John Doe', 'john@example.com');

-- Valid Product
INSERT INTO products (name, sku, price, stock) VALUES ('Laptop', 'LAP-001', 1200.00, 10);
INSERT INTO products (name, sku, price, stock) VALUES ('Mouse', 'MOU-001', 25.00, 50);

-- BUG 1: Orphaned Order (customer_id 999 does not exist)
INSERT INTO orders (customer_id, status) VALUES (999, 'completed');

-- BUG 2: Status Mismatch
INSERT INTO orders (id, customer_id, status) VALUES (2, 1, 'pending');
INSERT INTO payments (order_id, status, amount) VALUES (2, 'completed', 1200.00);

-- BUG 3: Inventory Leak (Negative stock and NULL quantity)
INSERT INTO products (name, sku, price, stock) VALUES ('Broken Phone', 'PHO-666', 500.00, -5);
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (2, 1, NULL, 1200.00);
