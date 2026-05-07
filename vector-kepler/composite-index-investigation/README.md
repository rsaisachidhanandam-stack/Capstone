# Composite Index Investigation | Challenge #4

This project demonstrates how column ordering in composite indexes affects database performance. It specifically explores the **Left-Most Prefix Rule** in PostgreSQL.

## Project Structure
- `db/schema.sql`: Database table definition and initial index.
- `db/sample_data.sql`: Seed script to populate the database with 10,000+ records.
- `db/queries.sql`: Analysis scripts using `EXPLAIN ANALYZE`.
- `Changes.md`: Detailed explanation of findings and the fix.

## Setup Instructions
1. **Initialize Database**:
   Ensure you have PostgreSQL installed and running.
   ```bash
   psql -U your_username -d your_database -f db/schema.sql
   ```

2. **Seed Data**:
   ```bash
   psql -U your_username -d your_database -f db/sample_data.sql
   ```

3. **Run Analysis**:
   Follow the steps in `db/queries.sql` to observe the performance difference.

## Key Learning
The order of columns in a composite index should follow the **Equality then Range** pattern. Columns used with equality filters (`=`) should come before columns used with range filters (`>`, `<`, `BETWEEN`).
