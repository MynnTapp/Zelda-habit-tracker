# Zelda-habit-tracker


# 🎮 Code Combat API

A game-based learning platform where users:
- Solve coding challenges to defeat villains 🦹
- Build habits to earn rewards 💰
- Track progress through XP systems 🏆

## 🌐 API Base URL: https://zelda-habit-tracker.onrender.com




## 📚 API Endpoints

### 🛡️ Authentication
| Endpoint          | Method | Description                     | Auth Required |
|-------------------|--------|---------------------------------|---------------|
| `/api/register`   | POST   | Register new user               | No            |
| `/api/login`      | POST   | Login and get JWT token         | No            |
| `/api/logout`     | POST   | Logout and invalidate token     | Yes           |
| `/api/admin/login`| POST   | Admin login                     | No            |

### 🎮 Challenges
| Endpoint                              | Method | Description                     | Auth Required |
|---------------------------------------|--------|---------------------------------|---------------|
| `/api/challenge/easy`                 | GET    | Get all easy challenges         | Yes           |
| `/api/challenge/easy/{challengeId}`   | GET    | Get specific easy challenge     | Yes           |
| `/api/challenge/{challengeId}/submit` | POST   | Submit challenge solution       | Yes           |

### 📊 Habits
| Endpoint                      | Method | Description                     | Auth Required |
|-------------------------------|--------|---------------------------------|---------------|
| `/api/habits`                 | POST   | Create new habit                | Yes           |
| `/api/habits/{habitId}/complete` | PUT  | Mark habit as completed         | Yes           |

### 👾 Villains
| Endpoint                | Method | Description               | Auth Required |
|-------------------------|--------|---------------------------|---------------|
| `/api/villains/{villainId}` | GET | Get villain details       | Yes           |


## 🔥 Key Features
- **JWT Authentication** with HTTP-only cookies
- **Role-based access** (Users & Admins)
- **Villain combat system** with code submissions
- **Habit tracking** with daily rewards
- **Swagger documentation** built-in

## 🚀 Quick Start

### 1. Get Access (user)
```bash
# Register new user
curl -X POST https://your-api-name.onrender.com/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "coder123",
    "email": "test@employer.com",
    "password": "test1234",
    "first_name": "Test",
    "last_name": "User"
  }'

# Login (stores JWT in cookies)
curl -X POST https://your-api-name.onrender.com/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@employer.com","password":"test1234"}'

# Admin credentials for testing
username: adminEmployer34
password: admin89



## ⚠️ Common Status Codes

| Code | Description                          |
|------|--------------------------------------|
| 400  | Bad Request (validation errors)      |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (admin access required)    |
| 404  | Resource Not Found                   |
| 500  | Server Error                         |

## 🛠️ Testing Tools

**Interactive Docs:**  
[Swagger UI](https://your-api-name.onrender.com/api-docs)  
![Swagger Preview](![Screenshot (110)](https://github.com/user-attachments/assets/b96e39a7-e896-4ba5-b9f1-55075e6f158f)

**Postman Collection:**  
[Download Collection](link-to-postman-export) *(optional)*

**Sample Frontend:**  
[GitHub Repo](link-to-frontend-demo) *(optional)*

## 💡 Architecture Highlights

- **MongoDB** for data storage
- **JWT** for stateless authentication
- **Render.com** for cloud hosting
- **Express.js** middleware pipeline

## 📝 Developer Notes

- All challenge submissions are tested against predefined test cases
- Habits reward:
  - 10 rupees 💰
  - 20 XP 🏆 per completion
- Villains lose 5 HP ❤️ per successful code submission
