const express = require("express");
const cors = require("cors");
require("dotenv").config();

// Routerlarni chaqirib olamiz
const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routerlarni ulaymiz
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);

// Test uchun
app.get("/", (req, res) => {
    res.send("Clinic API is working...");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ishga tushdi: ${PORT}`);
});