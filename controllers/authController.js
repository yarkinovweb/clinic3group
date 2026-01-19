const pool = require("../db.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER (Foydalanuvchi va uning profilini yaratish)
exports.register = async (req, res) => {
  // Tranzaksiya uchun klient olamiz
  const client = await pool.connect();
  
  try {
    const { name, email, password, role, specialization, working_hours, phone, date_of_birth } = req.body;
    
    // 1. Validatsiya
    if (!['admin', 'doctor', 'patient'].includes(role)) {
        return res.status(400).json({ message: "Noto'g'ri rol!" });
    }

    // 2. Tranzaksiyani boshlaymiz
    await client.query('BEGIN');

    // 3. Userni asosiy 'users' jadvaliga qo'shamiz
    const shifrlanganPassword = await bcrypt.hash(password, 10);
    const userResult = await client.query(
      "INSERT INTO users(name, email, password, role) VALUES($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, shifrlanganPassword, role]
    );
    
    const newUser = userResult.rows[0];

    // 4. Rolga qarab profil jadvallarini to'ldiramiz
    if (role === 'doctor') {
        // Doktor uchun qo'shimcha ma'lumotlar bormi?
        if (!specialization || !working_hours) {
            throw new Error("Doktorlar uchun 'specialization' va 'working_hours' kiritish shart!");
        }
        await client.query(
            "INSERT INTO doctor_profiles(user_id, specialization, working_hours) VALUES($1, $2, $3)",
            [newUser.id, specialization, working_hours]
        );
    } 
    else if (role === 'patient') {
        // Bemor uchun qo'shimcha ma'lumotlar bormi?
        if (!phone || !date_of_birth) {
             throw new Error("Bemorlar uchun 'phone' va 'date_of_birth' kiritish shart!");
        }
        await client.query(
            "INSERT INTO patient_profiles(user_id, phone, date_of_birth) VALUES($1, $2, $3)",
            [newUser.id, phone, date_of_birth]
        );
    }

    // 5. Hammasi yaxshi bo'lsa, saqlaymiz (COMMIT)
    await client.query('COMMIT');

    res.status(201).json({ 
        message: "Foydalanuvchi va profil muvaffaqiyatli yaratildi", 
        user: newUser 
    });

  } catch (error) {
    // Xatolik bo'lsa, orqaga qaytaramiz (ROLLBACK)
    await client.query('ROLLBACK');
    console.log(error);
    
    // Agar xato bizning validatsiyamizdan bo'lsa 400, aks holda 500
    if (error.message.includes("shart!")) {
        res.status(400).json({ message: error.message });
    } else {
        res.status(500).json({ message: "Serverda xatolik: " + error.message });
    }
  } finally {
    // Klientni hovuzga (pool) qaytaramiz
    client.release();
  }
};

// LOGIN funksiyasi o'zgarishsiz qoladi
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    
    if (result.rowCount === 0) return res.status(404).json({ message: "Email yoki parol xato" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(404).json({ message: "Email yoki parol xato" });

    const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: "24h" }
    );

    res.status(200).json({ message: "Muvaffaqiyatli login", token, user: { id: user.id, role: user.role } });

  } catch (error) {
    res.status(500).json({ message: "Serverda xatolik" });
  }
};