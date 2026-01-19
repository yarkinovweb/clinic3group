const express = require("express");
const { 
    createAppointment, 
    getAllAppointments, 
    updateAppointmentStatus 
} = require("../controllers/appointmentController.js");
const { authentication } = require("../middlewares/authentication.js");
const { rolecheck } = require("../middlewares/rolecheck.middleware.js");

const apptRouter = express.Router();

// Hamma endpointlar login qilgan bo'lishi shart
apptRouter.use(authentication);

// 1. GET (Ko'rish) - Hamma kirishi mumkin (Controller ichida ajratilgan)
apptRouter.get("/", getAllAppointments);

// 2. POST (Yaratish) - Faqat Patient
apptRouter.post("/", rolecheck("patient"), createAppointment);

// 3. PUT (O'zgartirish) - Hamma (Lekin mantiq controller ichida)
apptRouter.put("/:id", rolecheck("admin", "doctor", "patient"), updateAppointmentStatus);

module.exports = apptRouter;
