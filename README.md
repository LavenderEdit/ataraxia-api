<p align="center">
  <a href="https://endearing-blini-6a6b91.netlify.app/" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1TuT30CiBkinh85WuTvjKGKN47hCyCS0Z" width="300" alt="Studios TKOH Logo">
  </a>
</p>

# 🌌 Ataraxia API - v0.2

Infraestructura backend de alto rendimiento para la productividad personal y la gamificación.

**Ataraxia API** es el núcleo de una plataforma diseñada para ayudar a los usuarios a gestionar su tiempo y tareas mediante técnicas como **Pomodoro**, potenciado por un sistema de **gamificación** que recompensa la consistencia.

Desarrollada con **NestJS** y **MySQL**, esta versión **v0.2** introduce una arquitectura escalable, seguridad robusta y despliegue optimizado con **Docker**.

---

## 📄 Documentación

- 📘 [Read this README in English](README.en.md)
- 📑 [Documentación Interactiva (Swagger)](https://ataraxia-api.studios-tkoh.online/docs)

---

## 🚀 Características Principales (v0.2)

### 🎮 Gamificación y Logros

- **Sistema de Rachas (Streaks):**  
  Cálculo automático de la actividad diaria.

- **Logros Desbloqueables:**  
  Sistema de recompensas (ej. *"Primer Pomodoro"*, *"Racha de 7 días"*).

- **Integración con Google Drive:**  
  Iconos e insignias servidos dinámicamente desde Drive.

---

### 🛡️ Seguridad de Grado Industrial

- **Autenticación JWT Dual:**  
  Access Tokens (15 min) y Refresh Tokens (7 días).

- **Protección de Datos:**  
  Hashing de refresh tokens en base de datos.

- **Hardening:**  
  Protección contra fuerza bruta (*Throttling*), cabeceras seguras (*Helmet*) y validación estricta con DTOs.

---

### ⚙️ Arquitectura Modular

- **Base de Datos Sólida:**  
  MySQL con migraciones automáticas y optimización de índices.

- **Configuración Multiplataforma:**  
  Preferencias de usuario por dispositivo (Web / Mobile).

- **Docker Ready:**  
  Imagen de producción optimizada (~150MB) usando *Multi-stage builds*.

---

## 🛣️ Endpoints Principales

💡 **Nota:** La documentación completa e interactiva está disponible en `/docs` cuando el servidor está en ejecución.

🔐 **Todos los endpoints protegidos requieren el header:**
```

Authorization: Bearer <access_token>

```

---

### 🔐 Autenticación (`/auth`)

| Método | Endpoint | Descripción |
|------|---------|------------|
| POST | `/auth/register` | Crea una nueva cuenta de usuario |
| POST | `/auth/login` | Inicia sesión y devuelve Access + Refresh Token |
| POST | `/auth/guest-login` | Crea o recupera sesión de invitado por `deviceId` |
| POST | `/auth/refresh` | Solicita un nuevo Access Token |
| POST | `/auth/logout` | Invalida el Refresh Token |

---

### 🏆 Gamificación (`/gamification`)

| Método | Endpoint | Descripción |
|------|---------|------------|
| GET | `/gamification/stats` | Estadísticas: racha, récord, nivel y logros |

---

### ⏱️ Temporizadores (`/timers`)

| Método | Endpoint | Descripción |
|------|---------|------------|
| GET | `/timers` | Historial de sesiones Pomodoro |
| POST | `/timers` | Registra una sesión y suma a la racha |
| PATCH | `/timers/:id` | Actualiza el estado de una sesión |

---

### 📋 Tareas (`/tasks`)

| Método | Endpoint | Descripción |
|------|---------|------------|
| GET | `/tasks` | Lista tareas del usuario |
| POST | `/tasks` | Crea una nueva tarea |
| PATCH | `/tasks/:id` | Completa o edita una tarea |
| DELETE | `/tasks/:id` | Eliminación lógica (*Soft Delete*) |

---

### ⚙️ Ajustes (`/settings`)

| Método | Endpoint | Descripción |
|------|---------|------------|
| GET | `/settings` | Obtiene configuración por plataforma |
| PATCH | `/settings` | Actualiza preferencias del usuario |

---

## 🛠️ Stack Tecnológico

- **Core:** NestJS
- **Base de Datos:** MySQL & TypeORM
- **Seguridad:** Passport, JWT, Bcrypt, Helmet
- **Validación:** class-validator & class-transformer
- **Infraestructura:** Docker & Docker Compose
- **Servicios Externos:** Google Drive API (assets)

---

## 📦 Guía de Instalación y Despliegue

### Requisitos

- Docker y Docker Compose (**Recomendado**)
- Node.js v20+ (solo desarrollo local)

---

## 🐳 Opción A: Despliegue Rápido con Docker

```bash
git clone https://github.com/lavenderedit/ataraxia-api.git
cd ataraxia-api
cp .env.example .env
docker-compose up -d --build
````

* API: `http://localhost:3000/api`
* Swagger UI: `http://localhost:3000/docs`

---

## 💻 Opción B: Desarrollo Local

```bash
npm install
npm run build
npm run migration:run
npm run start:dev
```

Asegúrate de tener MySQL corriendo y configurado en `.env`.

---

<p align="center">
  <sub>🛠️ Desarrollado con 💙 y mucho café por <strong>Studios TKOH!</strong></sub>
</p>
