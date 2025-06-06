# AI Korean Learning Chatbot v1.0

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
│   ├── src/
│   └── ...
│
├── frontend/        # React frontend
│   ├── Dockerfile
│   ├── src/
│   └── ...
│
├── ai_core/         # FastAPI AI core (Python)
│   ├── docker/
│        Dockerfile
│   ├── api/
│       ├── endpoints/
│       ├── schemas
│       └── api.py
│   ├── models/
│   └── ...
│
├── example.env             # Environment variables (edit as needed)
├── docker-compose.yaml
├── Taskfile.yaml
└── README.md
```

---

## Prerequisites

- **Node.js**: You can download it from the official Node.js website.
- **npm** (Node Package Manager)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or [Docker Engine](https://docs.docker.com/engine/install/) (Linux)
- **Task** install:

  Task is a task runner / build tool that aims to be simpler and easier to use than

  - Windows:
    ```bash
    choco install go-task
    ```

    ```bash
    pip install go-task-bin
    ```

  - Linux/MacOS:

    Task is available on Snapcraft source, but keep in mind that your Linux distribution should allow classic confinement for Snaps to Task work correctly:
    ```bash
    sudo snap install task --classic
    ```



---

## Configuration

### Environment Variables

If you need to customize the configuration, please refer to the comments in our `example.env` file and update the corresponding values in your `.env` file.

exp:
```env
NETWORK_NAME=kor-learning

POSTGRES_USER=fiktech
POSTGRES_PASSWORD=1234
POSTGRES_DB=ai_chatbot
POSTGRES_HOST=db
POSTGRES_PORT=5432

FASTAPI_PORT=8080
```

- Put your **OPENAI API Key** at `example.env` in `ai_core/`

- Copy `.env` or `example.env` to the project root if not present.

  - Linux/Mac
    ```bash
    chmod +x init-env.sh
    ./init-env.sh
    ```

  - Windows
    ```bash
    init-env.bat
    ```

---

## How to Run (Quick Start)

1. **Clone the repository:**

    ```bash
    git clone <your-repo-url>
    cd demo_chatbot
    ```
  
2. **Build and start all services using Docker Compose:**

    ```bash
    task build
    ```

    - The first build may take several minutes.
    - This will start **PostgreSQL**, **AI Core (FastAPI)**, **Backend (Node.js)**, and **Frontend (React+Nginx)**.

3. **Wait until all services are up.**  
   You can check logs with:

   ```bash
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

## Admin account
- **username**: fiktech
- **password**: 1234

---

## Common Issues & Solutions

- **Port already in use:**  
  Change the port in `docker-compose.yaml` or stop the process using that port.

- **Database authentication failed:**  
  If you change `POSTGRES_USER` or `POSTGRES_DB`, you must delete the old database volume:
  ```bash
  docker compose down -v
  rm -rf ./volumes/db/data
  docker compose up --build
  ```

- **Docker permission denied (Linux):**  
  Run with `sudo` or add your user to the `docker` group.

- **File changes not reflected:**  
  Rebuild the containers:
  ```bash
  task reset build
  ```

---

## Resetting the Database and others

To reset (delete all data):

```bash
task clear
```
---

## Restore backup database
```bash
# Stop services that use the database (if needed)
docker compose stop backend fastapi

# Delete the old database (if you want a clean restore)
docker exec -it postgres psql -U $POSTGRES_USER -d postgres -c "DROP DATABASE $POSTGRES_DB;"
docker exec -it postgres psql -U $POSTGRES_USER -d postgres -c "CREATE DATABASE $POSTGRES_DB;"

# Restore from a backup file (e.g., backup_20240606_120000.sql)
docker exec -i postgres psql -U $POSTGRES_USER -d $POSTGRES_DB < ./volumes/db/backups/backup_20240606_120000.sql

# Restart services that use the database
docker compose start backend fastapi

```

---

## Customization

- **Change ports:** Edit `docker-compose.yaml` and `.env`.
- **Change database credentials:** Edit `.env` and reset the volume as above.
- **Add Python/Node.js dependencies:** Edit `requirements.txt` or `package.json` and rebuild.

---

## Troubleshooting

- Check logs for any service:
  ```bash
  docker compose logs <service>
  ```
  Example:
  ```bash
  docker compose logs backend
  ```

- If you encounter issues, ensure Docker Desktop/Engine is running and you have enough free disk space.

---

## Contact

For further support, please open an issue or contact the project maintainer.

---

**Enjoy your AI Korean Learning Chatbot!**