const express = require("express");
const { authentication } = require("../middlewares/authentication.js");
const { rolecheck } = require("../middlewares/rolecheck.middleware.js");
const { getAllUsers, createDoctor, getAllDoctors } = require("../controllers/userController.js");

const userRouter = express.Router();

// Barcha routelar authentication talab qiladi
userRouter.use(authentication);

// Admin: View all users
userRouter.get("/", rolecheck("admin"), getAllUsers);

// Admin: Create doctor
userRouter.post("/doctor", rolecheck("admin"), createDoctor);

// Public (authenticated): Get all doctors
userRouter.get("/doctors", getAllDoctors);

module.exports = userRouter;
