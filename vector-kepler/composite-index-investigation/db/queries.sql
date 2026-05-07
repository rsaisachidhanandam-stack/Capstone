-- Step 1: Run the multi-column query and analyze performance
-- The query filters by department (equality) and salary (range)
-- With idx_salary_department (salary, department), performance might be poor
-- because the first column in the index is salary, but we are doing a range filter on it,
-- or if we were only filtering by department, it would definitely be a seq scan.

EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
AND salary > 50000;

-- Step 2: Create the correct index
-- Following the Left-Most Prefix Rule and selectivity:
-- Department is an equality filter, so it should come first.
-- Salary is a range filter, so it should come second.

DROP INDEX IF EXISTS idx_salary_department;
CREATE INDEX idx_department_salary ON employees(department, salary);

-- Step 3: Run the query again to see performance improvement
EXPLAIN ANALYZE
SELECT *
FROM employees
WHERE department = 'Sales'
AND salary > 50000;
