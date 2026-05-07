-- Seed data for employees table
-- Generate a large number of records to demonstrate indexing performance

INSERT INTO employees (name, department, salary, hire_date)
SELECT 
    'Employee ' || i,
    CASE 
        WHEN i % 5 = 0 THEN 'Sales'
        WHEN i % 5 = 1 THEN 'Engineering'
        WHEN i % 5 = 2 THEN 'Marketing'
        WHEN i % 5 = 3 THEN 'HR'
        ELSE 'Finance'
    END,
    (RANDOM() * 100000 + 30000)::NUMERIC(10,2),
    CURRENT_DATE - (RANDOM() * 3650)::INT
FROM generate_series(1, 10000) s(i);

-- Ensure some records specifically match our "Sales" and "High Salary" query
INSERT INTO employees (name, department, salary, hire_date)
VALUES 
('John Doe', 'Sales', 55000, '2022-01-01'),
('Jane Smith', 'Sales', 62000, '2021-06-15'),
('Bob Johnson', 'Engineering', 95000, '2020-03-10');
