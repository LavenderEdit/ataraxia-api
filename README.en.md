<p align="center">
  <a href="https://endearing-blini-6a6b91.netlify.app/" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1TuT30CiBkinh85WuTvjKGKN47hCyCS0Z" width="300" alt="Studios TKOH Logo">
  </a>
</p>

# 🌌 Ataraxia API - v0.2

High-performance backend infrastructure for personal productivity and gamification.

**Ataraxia API** is the core of a platform designed to help users manage their time and tasks through techniques like **Pomodoro**, powered by a **gamification system** that rewards consistency.

Built with **NestJS** and **MySQL**, version **v0.2** introduces a scalable architecture, robust security, and optimized deployment with **Docker**.

---

## 📄 Documentation

- 📘 [Leer este README en Español](README.md)
- 📑 [Interactive Documentation (Swagger)](https://ataraxia-api.studios-tkoh.online/docs)

---

## 🚀 Key Features (v0.2)

### 🎮 Gamification & Achievements

- **Streak System:**  
  Automatic calculation of daily user activity streaks.

- **Unlockable Achievements:**  
  Reward system based on milestones (e.g., *"First Pomodoro"*, *"7-Day Streak"*).

- **Google Drive Integration:**  
  Achievement icons and badges served dynamically from Drive.

---

### 🛡️ Enterprise-Grade Security

- **Dual JWT Authentication:**  
  Secure sessions using short-lived Access Tokens (15 min) and persistent Refresh Tokens (7 days).

- **Data Protection:**  
  Database hashing of refresh tokens to prevent session hijacking.

- **Hardening:**  
  Brute-force protection (Throttling), secure headers (Helmet), and strict DTO-based validation.

---

### ⚙️ Modular Architecture

- **Solid Database:**  
  MySQL with automatic migrations and index optimization.

- **Multi-platform Settings:**  
  Device-specific user preferences (Web / Mobile / Desktop).

- **Docker Ready:**  
  Optimized production image (~150MB) using Multi-stage builds.

---

## 🛣️ Main Endpoints

💡 **Note:** Full interactive documentation is available at `/docs` when the server is running.

🔐 **All protected endpoints require the header:**
```

Authorization: Bearer <access_token>

```

---

### 🔐 Authentication (`/auth`)

| Method | Endpoint | Description |
|------|---------|------------|
| POST | `/auth/register` | Creates a new user account |
| POST | `/auth/login` | Returns Access Token + Refresh Token |
| POST | `/auth/guest-login` | Creates or retrieves a guest session via `deviceId` |
| POST | `/auth/refresh` | Requests a new Access Token |
| POST | `/auth/logout` | Invalidates the Refresh Token |

---

### 🏆 Gamification (`/gamification`)

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/gamification/stats` | Current streak, longest streak, level, achievements |

---

### ⏱️ Timers (`/timers`)

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/timers` | Pomodoro session history |
| POST | `/timers` | Registers a session and increases streak |
| PATCH | `/timers/:id` | Updates session status |

---

### 📋 Tasks (`/tasks`)

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/tasks` | Lists all user tasks |
| POST | `/tasks` | Creates a new task |
| PATCH | `/tasks/:id` | Completes or edits a task |
| DELETE | `/tasks/:id` | Soft deletes a task |

---

### ⚙️ Settings (`/settings`)

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/settings` | Gets configuration by platform |
| PATCH | `/settings` | Updates user preferences |

---

## 🛠️ Tech Stack

- **Core:** NestJS (Node.js framework)
- **Database:** MySQL & TypeORM
- **Security:** Passport, JWT, Bcrypt, Helmet
- **Validation:** class-validator & class-transformer
- **Infrastructure:** Docker & Docker Compose
- **External Services:** Google Drive API (assets)

---

## 📦 Installation & Deployment Guide

### Prerequisites

- Docker and Docker Compose (**Recommended**)
- Node.js v20+ (manual local development only)

---

## 🐳 Option A: Quick Deployment with Docker

```bash
git clone https://github.com/lavenderedit/ataraxia-api.git
cd ataraxia-api
cp .env.example .env
docker-compose up -d --build
````

* API: `http://localhost:3000/api`
* Swagger UI: `http://localhost:3000/docs`

---

## 💻 Option B: Local Development

```bash
npm install
npm run build
npm run migration:run
npm run start:dev
```

Make sure MySQL is running and properly configured in `.env`.

---

<p align="center">
  <sub>🛠️ Made with 💙 and lots of coffee by <strong>Studios TKOH!</strong></sub>
</p>
