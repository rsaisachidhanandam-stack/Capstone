const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// Routes for testing
app.get('/orders', (req, res) => {
    db.all('SELECT * FROM orders', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/orders', (req, res) => {
    const { customer_id, status } = req.body;
    db.run('INSERT INTO orders (customer_id, status) VALUES (?, ?)', [customer_id, status], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`OrderFlow API running on http://localhost:${PORT}`);
});
