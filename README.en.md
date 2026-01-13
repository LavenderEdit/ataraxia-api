<p align="center">
  <a href="https://endearing-blini-6a6b91.netlify.app/" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1TuT30CiBkinh85WuTvjKGKN47hCyCS0Z" width="300" alt="Studios TKOH Logo">
  </a>
</p>

# 🌌 Ataraxia API

**Ataraxia API** is a high-performance backend infrastructure designed to centralize personal productivity management.  
Developed with **NestJS**, this API provides a comprehensive ecosystem for task management, time tracking via timers, and organization through tags, all protected by a robust authentication system.

---

## Documentation in spanish
[README en español](README.md)

---

## 🚀 System Features

- **Modular Architecture**  
  Clean separation of concerns (`Tasks`, `Tags`, `Timers`, `Auth`, `Settings`).

- **Enterprise-Grade Security**  
  Route protection using **JWT** and strict data schema validation.

- **Smart Persistence**  
  Engineered for seamless integration with relational databases, ensuring user data integrity.

- **Flexible Productivity**  
  Support for traditional workflows and deep work sessions (**Pomodoro**).

---

## 🛣️ Detailed API Documentation

> All endpoints (except registration and login) require a **Bearer JWT** token in the request header:

```http
Authorization: Bearer <token>
````

---

## 🔐 Authentication Module (`/auth`)

Manages user access and identity.

| Method | Endpoint            | Body (JSON)                 | Description                                       |
| ------ | ------------------- | --------------------------- | ------------------------------------------------- |
| POST   | `/auth/register`    | `{ email, password, name }` | Creates a new user account                        |
| POST   | `/auth/login`       | `{ email, password }`       | Validates credentials and returns a JWT token     |
| POST   | `/auth/guest-login` | `{ deviceId }`              | Enables temporary guest access linked to a device |

---

## 📋 Task Module (`/tasks`)

Central control for user activities and to-dos.

| Method | Endpoint     | Body / Parameters                                                | Description                                  |
| ------ | ------------ | ---------------------------------------------------------------- | -------------------------------------------- |
| GET    | `/tasks`     | —                                                                | Fetches all tasks for the authenticated user |
| GET    | `/tasks/:id` | `id (uuid)`                                                      | Retrieves details of a specific task         |
| POST   | `/tasks`     | `{ title, description?, status?, priority?, dueDate?, tagIds? }` | Creates a new task                           |
| PATCH  | `/tasks/:id` | `{ title?, status?, priority?, ... }`                            | Partially updates task fields                |
| DELETE | `/tasks/:id` | `id (uuid)`                                                      | Permanently deletes a task                   |

---

## 🏷️ Tag Module (`/tags`)

Organization and categorization of elements.

| Method | Endpoint    | Body / Parameters        | Description                              |
| ------ | ----------- | ------------------------ | ---------------------------------------- |
| GET    | `/tags`     | —                        | Lists all tags created by the user       |
| GET    | `/tags/:id` | `id (uuid)`              | Retrieves information for a specific tag |
| POST   | `/tags`     | `{ name, color, icon? }` | Creates a tag with an identifying color  |
| PATCH  | `/tags/:id` | `{ name?, color? }`      | Modifies tag properties                  |
| DELETE | `/tags/:id` | `id (uuid)`              | Removes the tag from the system          |

---

## ⏱️ Timer Module (`/timers`)

Logs for focus sessions and elapsed time tracking.

| Method | Endpoint      | Body / Parameters             | Description                    |
| ------ | ------------- | ----------------------------- | ------------------------------ |
| GET    | `/timers`     | —                             | History of user time sessions  |
| GET    | `/timers/:id` | `id (uuid)`                   | Queries a previous time record |
| POST   | `/timers`     | `{ duration, type, taskId? }` | Logs a finished session        |
| PATCH  | `/timers/:id` | `{ duration?, type? }`        | Corrects recorded session data |
| DELETE | `/timers/:id` | `id (uuid)`                   | Deletes a record from history  |

---

## ⚙️ Settings Module (`/settings`)

User experience personalization preferences.

| Method | Endpoint        | Body / Parameters                          | Description                          |
| ------ | --------------- | ------------------------------------------ | ------------------------------------ |
| GET    | `/settings`     | —                                          | Retrieves current user configuration |
| POST   | `/settings`     | `{ theme, notifications, focusMode, ... }` | Sets initial profile configuration   |
| PATCH  | `/settings/:id` | `{ theme?, language? }`                    | Updates specific preferences         |

---

## 🛠️ Technologies & Standards

* **Core:** NestJS (Node.js framework)
* **Language:** TypeScript (Strict typing)
* **Security:** JWT & Passport
* **Validation:** `ValidationPipe` with `class-validator`
* **Deployment:** Docker-ready (`Dockerfile`, `docker-compose.yml`)

---

## 📦 Installation Guide

### 🔽 Cloning

```bash
git clone https://github.com/your-username/ataraxia-api.git
cd ataraxia-api
```

### ⚙️ Environment Setup

Install dependencies and configure your `.env` file:

```bash
npm install
```

### ▶️ Direct Execution

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

### 🐳 Docker

```bash
docker-compose up --build -d
```

---

<p align="center">
  <sub>🛠️ Developed with 💙 by <strong>Studios TKOH</strong></sub>
</p>
