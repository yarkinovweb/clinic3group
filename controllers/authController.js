const pool = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, working_hours, phone, date_of_birth } = req.body;
    
    if (!['admin', 'doctor', 'patient'].includes(role)) {
        return res.status(400).json({ message: "Noto'g'ri rol!" });
    }

    const shifrlanganPassword = await bcrypt.hash(password, 10);
    
    // User yaratish
    const result = await pool.query(
      "INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING *",
      [name, email, shifrlanganPassword, role]
    );

    const user = result.rows[0];

    // Agar Doctor bo'lsa, doctor_profiles yaratish
    if (role === 'doctor') {
      await pool.query(
        "INSERT INTO doctor_profiles(user_id, specialization, working_hours) VALUES($1, $2, $3)",
        [user.id, specialization || 'General', working_hours || '9:00-17:00']
      );
    }

    // Agar Patient bo'lsa, patient_profiles yaratish
    if (role === 'patient') {
      await pool.query(
        "INSERT INTO patient_profiles(user_id, phone, date_of_birth) VALUES($1, $2, $3)",
        [user.id, phone || null, date_of_birth || null]
      );
    }
    
    res.status(201).json({ 
      message: "User muvaffaqiyatli yaratildi", 
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Email yoki parol xato" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(404).json({ message: "Email yoki parol xato" });
    }

    // Token yaratish
    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "24h" }
    );

    res.status(200).json({ 
        message: "Muvaffaqiyatli login", 
        token: token,
        user: { id: user.id, name: user.name, role: user.role }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Serverda xatolik" });
  }
};
