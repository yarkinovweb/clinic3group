const pool = require("../db.js");
const bcrypt = require("bcryptjs");

// Admin: View all users
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Create Doctor
exports.createDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, working_hours } = req.body;

    // Validatsiya
    if (!name || !email || !password || !specialization) {
      return res.status(400).json({ 
        message: "Name, email, password va specialization majburiy!" 
      });
    }

    // Parolni shifrlash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Doctor yaratish (users table)
    const userResult = await pool.query(
      "INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, 'doctor') RETURNING *",
      [name, email, hashedPassword]
    );

    const doctor = userResult.rows[0];

    // Doctor profile yaratish
    await pool.query(
      "INSERT INTO doctor_profiles(user_id, specialization, working_hours) VALUES($1, $2, $3)",
      [doctor.id, specialization, working_hours || '9:00-17:00']
    );

    res.status(201).json({
      message: "Doctor muvaffaqiyatli yaratildi",
      doctor: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        role: doctor.role,
        specialization: specialization,
        working_hours: working_hours || '9:00-17:00'
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// Get all doctors with their profiles
exports.getAllDoctors = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.name, u.email, dp.specialization, dp.working_hours 
       FROM users u 
       INNER JOIN doctor_profiles dp ON u.id = dp.user_id 
       WHERE u.role = 'doctor'
       ORDER BY u.name`
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
