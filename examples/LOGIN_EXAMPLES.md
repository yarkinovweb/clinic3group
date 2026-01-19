# 🔐 Login API Examples

Bu hujjat Clinic API da login qilish uchun to'liq examplelarni o'z ichiga oladi.

## 📋 Umumiy Ma'lumot

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "parol123"
}
```

**Response (Success):**
```json
{
  "message": "Muvaffaqiyatli login",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "name": "Foydalanuvchi Ismi",
    "role": "patient"
  }
}
```

**Response (Error):**
```json
{
  "message": "Email yoki parol xato"
}
```

---

## 🧪 Test Uchun Examplelar

### 1. Admin Login

#### cURL
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "admin123"
  }'
```

#### JavaScript (fetch)
```javascript
fetch('http://localhost:3000/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'admin@clinic.com',
    password: 'admin123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('Success:', data);
  // Tokenni localStorage ga saqlash
  localStorage.setItem('token', data.token);
  localStorage.setItem('user', JSON.stringify(data.user));
})
.catch(error => console.error('Error:', error));
```

#### Node.js (axios)
```javascript
const axios = require('axios');

async function login() {
  try {
    const response = await axios.post('http://localhost:3000/auth/login', {
      email: 'admin@clinic.com',
      password: 'admin123'
    });
    
    console.log('Login muvaffaqiyatli!');
    console.log('Token:', response.data.token);
    console.log('User:', response.data.user);
    
    return response.data.token;
  } catch (error) {
    console.error('Login xatosi:', error.response?.data?.message);
  }
}

login();
```

---

### 2. Doctor Login

#### cURL
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "doctor@clinic.com",
    "password": "doctor123"
  }'
```

#### JavaScript (fetch)
```javascript
async function doctorLogin() {
  try {
    const response = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'doctor@clinic.com',
        password: 'doctor123'
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Doctor login muvaffaqiyatli!');
      localStorage.setItem('token', data.token);
      return data;
    } else {
      console.error('Xatolik:', data.message);
    }
  } catch (error) {
    console.error('Network xatosi:', error);
  }
}

doctorLogin();
```

---

### 3. Patient Login

#### cURL
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "patient@clinic.com",
    "password": "patient123"
  }'
```

#### JavaScript (fetch)
```javascript
async function patientLogin(email, password) {
  const response = await fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (response.ok) {
    // Token va user ma'lumotlarini saqlash
    sessionStorage.setItem('token', data.token);
    sessionStorage.setItem('userId', data.user.id);
    sessionStorage.setItem('userName', data.user.name);
    sessionStorage.setItem('userRole', data.user.role);
    
    console.log('Xush kelibsiz,', data.user.name);
    return data;
  } else {
    throw new Error(data.message);
  }
}

// Ishlatish
patientLogin('patient@clinic.com', 'patient123')
  .then(data => console.log('Logged in:', data.user))
  .catch(error => console.error('Login failed:', error.message));
```

---

## 🔑 Tokendan Foydalanish

Login qilgandan so'ng, tokenni keyingi requestlarda ishlatish kerak:

### Protected Endpoint ga Request

#### cURL
```bash
# Avval login qiling va tokenni oling
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Token bilan request
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer $TOKEN"
```

#### JavaScript (fetch)
```javascript
async function getProtectedData() {
  const token = localStorage.getItem('token');
  
  const response = await fetch('http://localhost:3000/users', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  
  const data = await response.json();
  return data;
}
```

#### Node.js (axios)
```javascript
const axios = require('axios');

async function getUsersWithAuth(token) {
  try {
    const response = await axios.get('http://localhost:3000/users', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Users:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error:', error.response?.data?.message);
  }
}
```

---

## 🌐 React Example

```javascript
import React, { useState } from 'react';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

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
        // Token va user ma'lumotlarini saqlash
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Sahifani yangilash yoki redirect
        window.location.href = '/dashboard';
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Serverga ulanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      
      {error && <div className="error">{error}</div>}
      
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <button type="submit" disabled={loading}>
        {loading ? 'Loading...' : 'Login'}
      </button>
    </form>
  );
}

export default LoginForm;
```

---

## 🔒 Logout Example

```javascript
function logout() {
  // Tokenni o'chirish
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.clear();
  
  // Login sahifasiga yo'naltirish
  window.location.href = '/login';
}
```

---

## 🛡️ Token Validation Example

```javascript
function isAuthenticated() {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return false;
  }
  
  // Token muddatini tekshirish (optional)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // milliseconds ga o'tkazish
    
    if (Date.now() >= exp) {
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}

// Protected route uchun
function ProtectedRoute() {
  if (!isAuthenticated()) {
    window.location.href = '/login';
    return;
  }
  
  // User logged in, davom etish
}
```

---

## ⚠️ Xatoliklar va Errorlar

### 404 - Email yoki parol xato
```json
{
  "message": "Email yoki parol xato"
}
```

### 500 - Server xatosi
```json
{
  "message": "Serverda xatolik"
}
```

### 400 - Validatsiya xatosi
```json
{
  "message": "Email va parol kiritish shart"
}
```

---

## 📱 Mobile (React Native) Example

```javascript
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
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
        // Token saqlash
        await AsyncStorage.setItem('token', data.token);
        await AsyncStorage.setItem('user', JSON.stringify(data.user));
        
        Alert.alert('Success', 'Login muvaffaqiyatli!');
        // Navigate to home screen
      } else {
        Alert.alert('Error', data.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Network xatosi');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
```

---

## 🧪 Test Users

Sistemada test qilish uchun quyidagi userlardan foydalanish mumkin (agar bazada mavjud bo'lsa):

| Role    | Email              | Password   |
|---------|-------------------|------------|
| Admin   | admin@clinic.com  | admin123   |
| Doctor  | doctor@clinic.com | doctor123  |
| Patient | patient@clinic.com| patient123 |

**Eslatma:** Haqiqiy production muhitda kuchli parollar ishlatilishi kerak!
