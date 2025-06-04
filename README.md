# AI Korean Learning Chatbot

This project is a **full-stack AI-powered chatbot** designed to help users learn Korean. It features a modern web interface, a Node.js backend, a FastAPI-based AI core, and a PostgreSQL database. The system is containerized using Docker for easy deployment.

---

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Configuration](#configuration)
- [How to Run (Quick Start)](#how-to-run-quick-start)
- [Accessing the Application](#accessing-the-application)
- [Common Issues & Solutions](#common-issues--solutions)
- [Resetting the Database](#resetting-the-database)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Contact](#contact)

---

## Features

- **Interactive Korean learning chatbot** powered by AI (OpenAI/GPT or custom models)
- Personalized learning plans, progress tracking, and resource recommendations
- User authentication and conversation history
- Modern React frontend with chat UI
- Node.js/Express backend API
- FastAPI Python AI core for language processing
- PostgreSQL database for persistent storage
- Dockerized for easy deployment

---

## Project Structure

```
demo_chatbot/
│
├── backend/         # Node.js backend (API)
│   ├── Dockerfile
│   └── ...
│
├── frontend/        # React frontend
│   ├── Dockerfile
│   └── ...
│
├── ai_core/         # FastAPI AI core (Python)
│   ├── docker/
│   │   └── Dockerfile
│   └── ...
│
├── volumes/         # (auto-created) for database persistence
│
├── .env             # Environment variables (edit as needed)
├── docker-compose.yaml
└── README.md
```

---

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or [Docker Engine](https://docs.docker.com/engine/install/) (Linux)
- [Git](https://git-scm.com/) (optional, for cloning the repo)

---

## Configuration

### 1. Environment Variables

Copy `.env` or `example.env` to the project root if not present.

Edit the following variables as needed (defaults are usually fine):

```env
NETWORK_NAME=kor-learning

POSTGRES_USER=fiktech
POSTGRES_PASSWORD=1234
POSTGRES_DB=ai_chatbot
POSTGRES_HOST=db
POSTGRES_PORT=5432

FASTAPI_PORT=8080
```

---

## How to Run (Quick Start)

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd demo_chatbot
   ```

2. **Build and start all services using Docker Compose:**

   ```sh
   docker compose up --build
   ```

   - The first build may take several minutes.
   - This will start **PostgreSQL**, **AI Core (FastAPI)**, **Backend (Node.js)**, and **Frontend (React+Nginx)**.

3. **Wait until all services are up.**  
   You can check logs with:

   ```sh
   docker compose logs -f
   ```

---

## Accessing the Application

- **Frontend (React):**  
  http://localhost:3000

- **Backend API (Node.js):**  
  http://localhost:8000

- **AI Core API (FastAPI):**  
  http://localhost:8080

- **PostgreSQL:**  
  Accessible on port 5432 (for admin tools like DBeaver, pgAdmin, etc.)

---

## Common Issues & Solutions

- **Port already in use:**  
  Change the port in `docker-compose.yaml` or stop the process using that port.

- **Database authentication failed:**  
  If you change `POSTGRES_USER` or `POSTGRES_DB`, you must delete the old database volume:
  ```sh
  docker compose down -v
  rm -rf ./volumes/db/data
  docker compose up --build
  ```

- **Docker permission denied (Linux):**  
  Run with `sudo` or add your user to the `docker` group.

- **File changes not reflected:**  
  Rebuild the containers:
  ```sh
  docker compose up --build
  ```

---

## Resetting the Database

To reset (delete all data):

```sh
docker compose down -v
rm -rf ./volumes/db/data
docker compose up --build
```

---

## Customization

- **Change ports:** Edit `docker-compose.yaml` and `.env`.
- **Change database credentials:** Edit `.env` and reset the volume as above.
- **Add Python/Node.js dependencies:** Edit `requirements.txt` or `package.json` and rebuild.

---

## Troubleshooting

- Check logs for any service:
  ```sh
  docker compose logs <service>
  ```
  Example:
  ```sh
  docker compose logs backend
  ```

- If you encounter issues, ensure Docker Desktop/Engine is running and you have enough free disk space.

---

## Contact

For further support, please open an issue or contact the project maintainer.

---

**Enjoy your AI Korean Learning Chatbot!**