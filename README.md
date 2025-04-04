# Zelda-habit-tracker


# 🎮 Code Combat API

A game-based learning platform where users:
- Solve coding challenges to defeat villains 🦹
- Build habits to earn rewards 💰
- Track progress through XP systems 🏆

## 🌐 API Base URL: https://zelda-habit-tracker.onrender.com





---

## 📚 API Endpoints

### 🛡️ Authentication

| Endpoint            | Method | Description                  | Auth Required |
|---------------------|--------|------------------------------|----------------|
| `/api/register`     | POST   | Register new user            | ❌             |
| `/api/login`        | POST   | Login and receive JWT token  | ❌             |
| `/api/logout`       | POST   | Logout and invalidate token  | ✅             |
| `/api/admin/login`  | POST   | Admin login                  | ❌             |

---

### 🎯 Challenges

| Endpoint                                 | Method | Description                    | Auth Required |
|------------------------------------------|--------|--------------------------------|----------------|
| `/api/challenge/easy`                    | GET    | Fetch all easy challenges      | ✅             |
| `/api/challenge/easy/{challengeId}`      | GET    | Fetch a specific challenge     | ✅             |
| `/api/challenge/{challengeId}/submit`    | POST   | Submit solution to challenge   | ✅             |

---

### 📊 Habits

| Endpoint                                 | Method | Description                    | Auth Required |
|------------------------------------------|--------|--------------------------------|----------------|
| `/api/habits`                            | POST   | Create a new habit             | ✅             |
| `/api/habits/{habitId}/complete`         | PUT    | Mark a habit as completed      | ✅             |

---

### 👾 Villains

| Endpoint                                 | Method | Description                    | Auth Required |
|------------------------------------------|--------|--------------------------------|----------------|
| `/api/villains/{villainId}`              | GET    | Get details about a villain    | ✅             |

---

## 🔥 Key Features

- Secure **JWT Authentication** with HTTP-only cookies
- Role-based access control: **Users vs Admins**
- Code-based **combat system** to defeat villains
- **Habit tracking** with XP & rupee rewards
- Built-in **Swagger API docs** for reference
- Exclusively tested using **Postman**

---

## 🚀 Quick Start (Postman Only)

1. **Import the API** into Postman
   - Use the Swagger JSON or export a Postman collection  
   - Or manually copy endpoints using the base URL

2. **Register a user**

```json
POST /api/register
{
  "username": "coder123",
  "email": "test@employer.com",
  "password": "test1234",
  "first_name": "Test",
  "last_name": "User"
}

POST /api/login
{
  "email": "test@employer.com",
  "password": "test1234"
}
```
## admin test credentials
```json
{
    "email": "Desmynn@zelda.com",
    "password": "MusaBearAdmin56"
}
```

## ⚠️ Common Status Codes

| Code | Description                          |
|------|--------------------------------------|
| 400  | Bad Request (validation errors)      |
| 401  | Unauthorized (missing/invalid token) |
| 403  | Forbidden (admin access required)    |
| 404  | Resource Not Found                   |
| 500  | Server Error                         |

---

## 🧪 Testing & Docs

### 📮 Postman-Only Testing

Postman is **required** for all interactions and testing.

> 🚫 No frontend? No problem.  
> 🧙‍♂️ Import the endpoints and play like a boss.

postman-link: https://api.postman.com/collections/38315964-fbd7a330-8fce-46e8-a3b4-d10bf85741ed?access_key=PMAT-01JR0ZJ57ZAVPCFPXVC5CEJZTE

1. Download link
2. import it into postman to use the collection


## 🛠️ Tech Stack

- **Node.js + Express.js**
- **MongoDB (Mongoose)**
- **JWT Authentication**
- **Render.com** for deployment

---

## 💡 Game Mechanics & Logic

- 🗡️ Villains lose **5 HP** per correct challenge
- 📆 Completing a habit rewards:
  - 💰 **10 Rupees**
  - 🏆 **20 XP**
- Code submissions are auto-tested with built-in logic

---

## 📝 Developer Notes

- All routes return meaningful status codes and error messages.
- Cookies are **HTTP-only** for enhanced security.
- No frontend is bundled – use **Postman** to simulate all behavior.
- Built for **fun**, **productivity**, and **developer practice** 💻


