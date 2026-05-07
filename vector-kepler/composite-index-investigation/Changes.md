# Database Index Investigation: Composite Index Performance

## 1. The Original Problem
The initial system had a composite index defined as:
```sql
CREATE INDEX idx_salary_department ON employees(salary, department);
```
Despite this index existing, queries filtering primarily by `department` were still performing **Sequential Scans** or inefficient index scans. Specifically, the query below was slow:
```sql
SELECT * FROM employees WHERE department = 'Sales' AND salary > 50000;
```

## 2. Why the Incorrect Index was Ineffective
The index `(salary, department)` was ineffective for this query due to the **Left-Most Prefix Rule** and the nature of the filters:
- **Left-Most Prefix Rule**: A B-tree index can only be used effectively if the query includes the first column(s) of the index. While our query *did* include `salary`, it used a **range filter** (`> 50000`).
- **Sorting Logic**: In a composite index `(A, B)`, the data is sorted by `A` first, and then within each equal value of `A`, it is sorted by `B`. 
- Since we queried a *range* of salaries, the `department` values were scattered across different salary nodes. The database couldn't jump straight to "Sales" within that range; it had to scan all entries where `salary > 50000`.

## 3. The Solution: Corrected Index Order
We swapped the column order to align with the **Equality-Range** principle:
```sql
CREATE INDEX idx_department_salary ON employees(department, salary);
```
- **Equality First**: By putting `department` first, all "Sales" records are physically grouped together in the index.
- **Selective Range**: Once the database finds the "Sales" grouping, the records within that group are already sorted by `salary`. It can then do a lightning-fast search for `salary > 50000` within that specific subset.

## 4. The Left-Most Prefix Rule
The Left-Most Prefix Rule states that a composite index on `(col1, col2, col3)` can be used for queries filtering on:
- `col1`
- `col1` and `col2`
- `col1`, `col2`, and `col3`

It **cannot** (usually) be used for queries filtering only on `col2` or `col3`, because the data is not sorted by those columns until the preceding columns are fixed to specific values.

## 5. Performance Comparison (Observed)
- **Incorrect Order**: Sequential Scan / High Cost (scanning many salary entries).
- **Corrected Order**: Index Scan / Low Cost (direct jump to Department -> Salary range).
