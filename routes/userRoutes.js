const express = require("express");
const pool = require("../db.js");
const { authentication } = require("../middlewares/authentication.js");
const { rolecheck } = require("../middlewares/rolecheck.middleware.js");

const userRouter = express.Router();

userRouter.use(authentication);

// Faqat Admin hamma userlarni ko'ra oladi
userRouter.get("/", rolecheck("admin"), async (req, res) => {
    try {
        const result = await pool.query("SELECT id, name, email, role FROM users");
        res.json(result.rows);
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

module.exports = userRouter;