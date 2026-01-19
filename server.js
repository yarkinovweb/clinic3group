const express = require('express');
const pool = require('./db');
const { authenticate, authorize } = require('./middleware/auth');
const app = express();
app.use(express.json());

// Middlewarelar
app.use(cors());
app.use(express.json());

// 1. Admin: Shifokor yaratish 
app.post('/admin/create-doctor', authenticate, authorize(['admin']), async (req, res) => {
  const { name, email, password, specialization } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const newUser = await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id',
      [name, email, password, 'doctor']
    );
    await client.query(
      'INSERT INTO doctor_profiles (user_id, specialization) VALUES ($1, $2)',
      [newUser.rows[0].id, specialization]
    );
    await client.query('COMMIT');
    res.status(201).json({ message: "Shifokor muvaffaqiyatli yaratildi" });
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally { client.release(); }
});

// 2. Patient: Uchrashuv yaratish 
app.post('/appointments', authenticate, authorize(['patient']), async (req, res) => {
  const { doctor_id, date } = req.body;
  const newAppt = await pool.query(
    'INSERT INTO appointments (doctor_id, patient_id, appointment_date) VALUES ($1, $2, $3) RETURNING *',
    [doctor_id, req.user.id, date]
  );
  res.status(201).json(newAppt.rows[0]);
});

// 3. Cancel Appointment: Ownership check bilan 
app.patch('/appointments/:id/cancel', authenticate, async (req, res) => {
  const { id } = req.params;
  const user = req.user;
  
  const appt = await pool.query('SELECT * FROM appointments WHERE id = $1', [id]);
  if (appt.rows.length === 0) return res.status(404).json({ message: "Topilmadi" });
  const data = appt.rows[0];

  let canCancel = false;
  // Ownership Logic 
  if (user.role === 'admin') canCancel = true;
  if (user.role === 'doctor' && data.doctor_id === user.id) canCancel = true;
  if (user.role === 'patient' && data.patient_id === user.id && data.status !== 'approved') canCancel = true;

  if (!canCancel) return res.status(403).json({ message: "Taqiqlangan amal" });

  await pool.query("UPDATE appointments SET status = 'cancelled' WHERE id = $1", [id]);
  res.json({ message: "Uchrashuv bekor qilindi" });
});

// 4. View Own Appointments 
app.get('/appointments/my', authenticate, authorize(['doctor', 'patient']), async (req, res) => {
  const field = req.user.role === 'doctor' ? 'doctor_id' : 'patient_id';
  const myAppts = await pool.query(`SELECT * FROM appointments WHERE ${field} = $1`, [req.user.id]);
  res.json(myAppts.rows);
});

app.listen(3000, () => console.log('Klinika tizimi 3000-portda ishlamoqda'));