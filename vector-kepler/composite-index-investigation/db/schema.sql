-- Create the employees table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    department VARCHAR(50),
    salary NUMERIC,
    hire_date DATE
);

-- Initial inefficient index (Incorrect Order)
-- The query usually filters by department first, then salary range.
-- Putting salary first makes the index less effective for equality on department.
CREATE INDEX idx_salary_department ON employees(salary, department);
