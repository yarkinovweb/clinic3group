const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');
const apptRouter = require('./routes/appointmentRoutes');

const app = express();
app.use(express.json());


app.use(cors());
app.use('/appointments',apptRouter)

app.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ 
            message: "API ulashni eplabsan, qoyil", 
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