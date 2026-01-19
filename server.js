const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

// Middlewarelar
app.use(cors());
app.use(express.json());

// Test uchun endpoint
app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ 
            message: "Clinic API ishlayapti!", 
            time: result.rows[0].now 
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server ${PORT}-portda ishga tushdi`);
});