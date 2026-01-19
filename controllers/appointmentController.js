const pool = require("../db.js");

// 1. Uchrashuv yaratish (Faqat Patient uchun)
exports.createAppointment = async (req, res) => {
  try {
    const { doctor_id, appointment_date } = req.body;
    const patient_id = req.user.id; // Token dan olinadi

    const result = await pool.query(
      `INSERT INTO appointments (doctor_id, patient_id, appointment_date, status) 
       VALUES ($1, $2, $3, 'pending') RETURNING *`,
      [doctor_id, patient_id, appointment_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 2. Uchrashuvlarni ko'rish (Rolga qarab har xil ishlaydi)
exports.getAllAppointments = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query = "";
    let params = [];

    if (role === 'admin') {
        // Admin hammasini ko'radi
        query = "SELECT * FROM appointments";
    } else if (role === 'doctor') {
        // Doktor faqat o'zinikini ko'radi
        query = "SELECT * FROM appointments WHERE doctor_id = $1";
        params = [id];
    } else if (role === 'patient') {
        // Patient faqat o'zinikini ko'radi
        query = "SELECT * FROM appointments WHERE patient_id = $1";
        params = [id];
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Statusni o'zgartirish (Approve/Cancel)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID
        const { status } = req.body; // 'approved' or 'cancelled'
        const userId = req.user.id;
        const userRole = req.user.role;

        // Avval uchrashuvni topamiz
        const apptResult = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
        if (apptResult.rows.length === 0) return res.status(404).json({message: "Topilmadi"});
        
        const appointment = apptResult.rows[0];

        // --- RUXSATLARNI TEKSHIRISH (Ownership Logic) ---
        
        // 1. Approve qilish (Faqat Doktor o'zinikini qila oladi)
        if (status === 'approved') {
            if (userRole !== 'doctor' || appointment.doctor_id !== userId) {
                return res.status(403).json({ message: "Siz buni tasdiqlay olmaysiz" });
            }
        }

        // 2. Cancel qilish (Admin hammasini, boshqalar faqat o'zinikini)
        if (status === 'cancelled') {
            if (userRole === 'doctor' && appointment.doctor_id !== userId) {
                 return res.status(403).json({ message: "Faqat o'z qabulingizni bekor qila olasiz" });
            }
            if (userRole === 'patient' && appointment.patient_id !== userId) {
                 return res.status(403).json({ message: "Faqat o'z arizangizni bekor qila olasiz" });
            }
        }

        // Statusni yangilash
        const result = await pool.query(
            "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}