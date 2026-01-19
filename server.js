const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();
app.use(express.json());

app.use(cors());

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
    console.log(`Girgitton ${PORT}portda ishlayapti`);
});