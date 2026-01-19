const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

// Import routes
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const apptRouter = require('./routes/appointmentRoutes');

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

// Routes
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/appointments', apptRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server ${PORT} portda ishlayapti`);
    console.log(`\n📋 Available endpoints:`);
    console.log(`   POST   /auth/register - User ro'yxatdan o'tish`);
    console.log(`   POST   /auth/login - Login`);
    console.log(`   GET    /users - Barcha userlar (Admin)`);
    console.log(`   POST   /users/doctor - Doctor yaratish (Admin)`);
    console.log(`   GET    /users/doctors - Barcha doctorlar`);
    console.log(`   GET    /appointments - O'z uchrashuvlarni ko'rish`);
    console.log(`   POST   /appointments - Uchrashuv yaratish (Patient)`);
    console.log(`   PUT    /appointments/:id - Status o'zgartirish\n`);
});
