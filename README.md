<p align="center">
  <a href="https://endearing-blini-6a6b91.netlify.app/" target="_blank">
    <img src="https://drive.google.com/uc?export=view&id=1TuT30CiBkinh85WuTvjKGKN47hCyCS0Z" width="300" alt="Studios TKOH Logo">
  </a>
</p>

# 🌌 Ataraxia API

**Ataraxia API** es una infraestructura backend de alto rendimiento diseñada para centralizar la gestión de la productividad personal.  
Desarrollada con **NestJS**, esta API ofrece un ecosistema completo para el manejo de tareas, seguimiento de tiempo mediante temporizadores y organización mediante etiquetas, todo bajo un sistema de autenticación robusto.

---

## Documentación en ingles
[README in english](README.en.md)

---

## 🚀 Características del Sistema

- **Arquitectura Modular**  
  Separación clara de responsabilidades (`Tasks`, `Tags`, `Timers`, `Auth`, `Settings`).

- **Seguridad de Grado Industrial**  
  Protección de rutas mediante **JWT** y validación estricta de esquemas de datos.

- **Persistencia Inteligente**  
  Diseñada para integrarse con bases de datos relacionales, manteniendo la integridad de los datos del usuario.

- **Productividad Flexible**  
  Soporte para flujos de trabajo tradicionales y sesiones de enfoque (**Pomodoro**).

---

## 🛣️ Documentación de la API

> Todos los endpoints (excepto registro y login) requieren un token **Bearer JWT** en la cabecera:

```http
Authorization: Bearer <token>
````

---

## 🔐 Módulo de Autenticación (`/auth`)

Gestiona el acceso y la identidad de los usuarios.

| Método | Endpoint            | Cuerpo (JSON)               | Descripción                                              |
| ------ | ------------------- | --------------------------- | -------------------------------------------------------- |
| POST   | `/auth/register`    | `{ email, password, name }` | Crea una nueva cuenta de usuario                         |
| POST   | `/auth/login`       | `{ email, password }`       | Valida credenciales y devuelve un JWT                    |
| POST   | `/auth/guest-login` | `{ deviceId }`              | Acceso temporal como invitado vinculado a un dispositivo |

---

## 📋 Módulo de Tareas (`/tasks`)

Control central de las actividades y pendientes del usuario.

| Método | Endpoint     | Cuerpo / Parámetros                                              | Descripción                          |
| ------ | ------------ | ---------------------------------------------------------------- | ------------------------------------ |
| GET    | `/tasks`     | —                                                                | Obtiene todas las tareas del usuario |
| GET    | `/tasks/:id` | `id (uuid)`                                                      | Obtiene una tarea específica         |
| POST   | `/tasks`     | `{ title, description?, status?, priority?, dueDate?, tagIds? }` | Crea una nueva tarea                 |
| PATCH  | `/tasks/:id` | `{ title?, status?, priority?, ... }`                            | Actualiza parcialmente una tarea     |
| DELETE | `/tasks/:id` | `id (uuid)`                                                      | Elimina permanentemente una tarea    |

---

## 🏷️ Módulo de Etiquetas (`/tags`)

Organización y categorización de elementos.

| Método | Endpoint    | Cuerpo / Parámetros      | Descripción                  |
| ------ | ----------- | ------------------------ | ---------------------------- |
| GET    | `/tags`     | —                        | Lista todas las etiquetas    |
| GET    | `/tags/:id` | `id (uuid)`              | Obtiene una etiqueta puntual |
| POST   | `/tags`     | `{ name, color, icon? }` | Crea una etiqueta            |
| PATCH  | `/tags/:id` | `{ name?, color? }`      | Modifica la etiqueta         |
| DELETE | `/tags/:id` | `id (uuid)`              | Elimina la etiqueta          |

---

## ⏱️ Módulo de Temporizadores (`/timers`)

Registro de sesiones de enfoque y tiempo transcurrido.

| Método | Endpoint      | Cuerpo / Parámetros           | Descripción           |
| ------ | ------------- | ----------------------------- | --------------------- |
| GET    | `/timers`     | —                             | Historial de sesiones |
| GET    | `/timers/:id` | `id (uuid)`                   | Consulta un registro  |
| POST   | `/timers`     | `{ duration, type, taskId? }` | Registra una sesión   |
| PATCH  | `/timers/:id` | `{ duration?, type? }`        | Corrige una sesión    |
| DELETE | `/timers/:id` | `id (uuid)`                   | Elimina el registro   |

---

## ⚙️ Módulo de Ajustes (`/settings`)

Preferencias de personalización del usuario.

| Método | Endpoint        | Cuerpo / Parámetros                        | Descripción                     |
| ------ | --------------- | ------------------------------------------ | ------------------------------- |
| GET    | `/settings`     | —                                          | Obtiene la configuración actual |
| POST   | `/settings`     | `{ theme, notifications, focusMode, ... }` | Configuración inicial           |
| PATCH  | `/settings/:id` | `{ theme?, language? }`                    | Actualiza preferencias          |

---

## 🛠️ Tecnologías y Estándares

* **Core:** NestJS
* **Lenguaje:** TypeScript (tipado estricto)
* **Seguridad:** JWT & Passport
* **Validación:** `ValidationPipe` + `class-validator`
* **Despliegue:** Docker (`Dockerfile` y `docker-compose.yml`)

---

## 📦 Guía de Instalación

### 🔽 Clonación

```bash
git clone https://github.com/tu-usuario/ataraxia-api.git
cd ataraxia-api
```

### ⚙️ Entorno

Instala dependencias y configura el archivo `.env`:

```bash
npm install
```

### ▶️ Ejecución

```bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
```

### 🐳 Docker

```bash
docker-compose up --build -d
```

---

<p align="center">
  <sub>🛠️ Desarrollado con 💙 por <strong>Studios TKOH</strong></sub>
</p>
