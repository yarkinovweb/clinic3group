const express = require("express");
const { 
    createAppointment, 
    getAllAppointments, 
    updateAppointmentStatus 
} = require("../controllers/appointmentController.js");
const { authentication } = require("../middlewares/authentication.js");
const { rolecheck } = require("../middlewares/rolecheck.middleware.js");

const apptRouter = express.Router();

apptRouter.use(authentication);

apptRouter.get("/", rolecheck("admin", "doctor", "patient"), getAllAppointments);

apptRouter.post("/", rolecheck("patient"), createAppointment);

apptRouter.put("/:id", rolecheck("admin", "doctor", "patient"), updateAppointmentStatus);

module.exports = apptRouter;