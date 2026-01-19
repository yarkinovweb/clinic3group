# 🏥 Clinic Management System API

Clinic Management System uchun RESTful API. Bu API administratorlar, doctorlar va patientlar uchun appointment (uchrashuv) boshqaruv tizimini ta'minlaydi.

## 📋 Mundarija

- [Texnologiyalar](#texnologiyalar)
- [O'rnatish](#ornatish)
- [Muhit O'zgaruvchilari](#muhit-ozgaruvchilari)
- [Database Setup](#database-setup)
- [Serverni Ishga Tushirish](#serverni-ishga-tushirish)
- [API Endpoints](#api-endpoints)
- [Authentication](#authentication)
- [Login Examples](#login-examples)
- [Testing](#testing)

---

## 🛠 Texnologiyalar

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

---

## 📦 O'rnatish

### 1. Repository ni clone qilish

```bash
git clone https://github.com/yarkinovweb/clinic3group.git
cd clinic3group
```

### 2. Dependencies o'rnatish

```bash
npm install
```

### 3. Environment variables sozlash

`.env` faylini yarating va quyidagi ma'lumotlarni kiriting:

```env
PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=clinic_db
DB_PASSWORD=your_password
DB_PORT=5432
JWT_SECRET=your_secret_key_here
```

### 4. Database yaratish

PostgreSQL-da yangi database yarating:

```sql
CREATE DATABASE clinic_db;
```

### 5. Tablelarni yaratish

```bash
psql -U postgres -d clinic_db -f migrations/create_tables.sql
```

Yoki `psql` orqali:

```sql
\i migrations/create_tables.sql
```

---

## 🗄️ Database Setup

Database tuzilishi:

- **users** - Barcha foydalanuvchilar (admin, doctor, patient)
- **doctor_profiles** - Doctor ma'lumotlari
- **patient_profiles** - Patient ma'lumotlari  
- **appointments** - Uchrashuvlar

---

## 🚀 Serverni Ishga Tushirish

```bash
npm start
```

Server `http://localhost:3000` da ishga tushadi.

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint        | Description          | Auth Required |
|--------|----------------|----------------------|---------------|
| POST   | `/auth/register` | User ro'yxatdan o'tish | ❌            |
| POST   | `/auth/login`    | Login                 | ❌            |

### Users

| Method | Endpoint          | Description                | Auth Required | Role    |
|--------|------------------|----------------------------|---------------|---------|
| GET    | `/users`         | Barcha userlar             | ✅            | Admin   |
| GET    | `/users/doctors` | Barcha doctorlar           | ✅            | All     |
| POST   | `/users/doctor`  | Yangi doctor yaratish      | ✅            | Admin   |

### Appointments

| Method | Endpoint              | Description              | Auth Required | Role           |
|--------|-----------------------|--------------------------|---------------|----------------|
| GET    | `/appointments`       | O'z uchrashuvlarini ko'rish | ✅            | Doctor/Patient |
| POST   | `/appointments`       | Uchrashuv yaratish       | ✅            | Patient        |
| PUT    | `/appointments/:id`   | Status o'zgartirish      | ✅            | Doctor/Admin   |

---

## 🔐 Authentication

API JWT (JSON Web Token) authentication dan foydalanadi.

### Login Qilish

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Muvaffaqiyatli login",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "User Name",
    "role": "patient"
  }
}
```

### Protected Endpoints

Protected endpointlarga kirish uchun Authorization header-da token yuborish kerak:

```bash
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

JavaScript-da:

```javascript
fetch('http://localhost:3000/users', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
```

---

## 📝 Login Examples

### Quick Start - Test qilish

#### 1. **HTML Test Sahifasi** (Eng oson)

```bash
# Serverni ishga tushiring
npm start

# Keyin browser-da oching
open examples/login-test.html
```

Bu sahifa orqali admin, doctor yoki patient sifatida tezda login qilishingiz mumkin!

#### 2. **cURL**

```bash
# Admin login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@clinic.com", "password": "admin123"}'

# Doctor login  
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "doctor@clinic.com", "password": "doctor123"}'

# Patient login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "patient@clinic.com", "password": "patient123"}'
```

#### 3. **JavaScript (Browser)**

```javascript
async function login(email, password) {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem('token', data.token);
      console.log('Login muvaffaqiyatli!', data.user);
      return data;
    } else {
      console.error('Login xatosi:', data.message);
    }
  } catch (error) {
    console.error('Network xatosi:', error);
  }
}

// Ishlatish
login('patient@clinic.com', 'patient123');
```

### 📚 Batafsil Examples

To'liq login examples va turli platformalar uchun kod namunalari:

👉 **[examples/LOGIN_EXAMPLES.md](examples/LOGIN_EXAMPLES.md)**

Bu faylda quyidagilar mavjud:
- cURL, JavaScript, Node.js examplelari
- React va React Native kodlari
- Token validation
- Error handling
- va ko'p boshqalar!

---

## 🧪 Testing

### Postman Collection

Postman-da test qilish uchun collection-ni import qiling:

1. Postman-ni oching
2. Import tugmasini bosing
3. `examples/Clinic_API.postman_collection.json` faylini tanlang
4. Collection import qilinadi

Collection ichida barcha endpointlar va test requestlar mavjud.

### Test Accounts

Sistemada test qilish uchun test userlar:

| Role    | Email              | Password   |
|---------|-------------------|------------|
| Admin   | admin@clinic.com  | admin123   |
| Doctor  | doctor@clinic.com | doctor123  |
| Patient | patient@clinic.com| patient123 |

**Eslatma:** Bu faqat development uchun. Production-da kuchli parollar ishlatilishi kerak!

---

## 📂 Loyiha Tuzilishi

```
clinic3group/
├── controllers/          # Request handler funksiyalari
│   ├── authController.js
│   ├── userController.js
│   └── appointmentController.js
├── middlewares/          # Middleware funksiyalari
│   ├── authentication.js
│   └── roleCheck.middleware.js
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── userRoutes.js
│   └── appointmentRoutes.js
├── migrations/          # Database migrations
│   └── create_tables.sql
├── examples/            # Examples va test fayllar
│   ├── LOGIN_EXAMPLES.md
│   ├── Clinic_API.postman_collection.json
│   └── login-test.html
├── .env                 # Environment variables
├── db.js               # Database connection
├── server.js           # Express server
└── package.json        # Dependencies
```

---

## 🔒 Security

- Parollar bcryptjs orqali hash qilinadi
- JWT tokenlar 24 soat amal qiladi
- Role-based access control (RBAC)
- Protected endpoints authentication middleware orqali himoyalangan

---

## 🤝 Contributing

1. Fork qiling
2. Feature branch yarating (`git checkout -b feature/AmazingFeature`)
3. O'zgarishlarni commit qiling (`git commit -m 'Add some AmazingFeature'`)
4. Branch-ni push qiling (`git push origin feature/AmazingFeature`)
5. Pull Request oching

---

## 📄 License

Bu loyiha ochiq kodli va erkin foydalanish uchun.

---

## 👥 Authors

- Yarkinov Web - [GitHub](https://github.com/yarkinovweb)

---

## 📞 Support

Savollar yoki muammolar bo'lsa, GitHub Issues-da murojaat qiling.

---

## 🎯 Roadmap

- [ ] Email verification
- [ ] Password reset functionality
- [ ] File upload (doctor sertifikatlari)
- [ ] Appointment reminder notifications
- [ ] Search va filter functionality
- [ ] Pagination
- [ ] API documentation (Swagger)

---

**Omad!** 🚀
