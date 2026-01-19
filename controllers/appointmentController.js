const pool = require("../db.js");

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

exports.getAllAppointments = async (req, res) => {
  try {
    const { id, role } = req.user;
    let query = "";
    let params = [];

    if (role === 'admin') {
        query = "SELECT * FROM appointments";
    } else if (role === 'doctor') {
        query = "SELECT * FROM appointments WHERE doctor_id = $1";
        params = [id];
    } else if (role === 'patient') {
        query = "SELECT * FROM appointments WHERE patient_id = $1";
        params = [id];
    }

    const result = await pool.query(query, params);
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID
        const { status } = req.body; // 'approved' or 'cancelled'
        const userId = req.user.id;
        const userRole = req.user.role;

        const apptResult = await pool.query("SELECT * FROM appointments WHERE id = $1", [id]);
        if (apptResult.rows.length === 0) return res.status(404).json({message: "Topilmadi"});
        
        const appointment = apptResult.rows[0];

        if (status === 'approved') {
            if (userRole !== 'doctor' || appointment.doctor_id !== userId) {
                return res.status(403).json({ message: "Sen adminmassanu" });
            }
        }

        if (status === 'cancelled') {
            if (userRole === 'doctor' && appointment.doctor_id !== userId) {
                 return res.status(403).json({ message: "Faqat o'zini qabulini bekor qilollesan" });
            }
            if (userRole === 'patient' && appointment.patient_id !== userId) {
                 return res.status(403).json({ message: "Faqat o'zini arizeni bekor qilollesan" });
            }
        }

        const result = await pool.query(
            "UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *",
            [status, id]
        );

        res.status(200).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}