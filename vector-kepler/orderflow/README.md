# OrderFlow - Debugging Challenge

This is a recreation of the OrderFlow system for Challenge #10: Debugging Production Database Failures.

## Project Structure
- `schema.sql`: The initial broken schema with seeded bugs.
- `database.js`: SQLite database initializer.
- `index.js`: Simple Express API to interact with the database.
- `fixes.sql`: SQL commands to resolve the root causes.
- `DEBUG-REPORT.md`: Full documentation of the debugging process (6 moves).

## How to Run locally
1. `npm install`
2. `node database.js` (Initializes database with bugs)
3. `node index.js` (Starts the server)

## The Debugging Task
The system contains 3 major production bugs:
1. **Orphaned Records**: Orders referencing non-existent customers.
2. **Status Inconsistency**: Orders and Payments logic out of sync.
3. **Inventory Integrity**: Negative stock and NULL quantities.

Check `DEBUG-REPORT.md` for the full investigation and fix trail.
