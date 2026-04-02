# 🚀 Job Queue System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-v10-orange)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-24-blue?logo=docker)](https://www.docker.com/)

A **Job Queue System** built with **NestJS**, **PostgreSQL**, and **Docker**, supporting asynchronous job processing, retries, and a background worker.

---

## ✨ Features

- REST API for job creation & management  
- Asynchronous background **worker**  
- Automatic **retry logic** for failed jobs  
- Fully **Dockerized** development environment  
- Environment-based configuration  

---

## 🏗 Architecture
[API Container] ---> [PostgreSQL Container] <--- [Worker Container]


| Component | Role |
|-----------|------|
| **API** | Handles job creation & management (Port 5000) |
| **Worker** | Polls pending jobs & updates status asynchronously |
| **PostgreSQL** | Stores all job data |
| **Docker Compose** | Orchestrates all services |


---

## ⚡ Installation & Running Locally

### 1. Clone the repository

git clone <your-github-repo-url>
cd job-queue-system

2. Create .env file

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=job_queue
JWT_SECRET=supersecret

3. Start Docker containers

docker-compose up --build
API: http://localhost:5000
Worker: Runs in the background and processes jobs

4. Stop containers
docker-compose down

📬 API Usage
Create Job

POST /jobs

Request Body:

{
  "type": "email",
  "payload": { "to": "example@gmail.com" }
}

Response Example (Pending Job):

{
  "id": 1,
  "type": "email",
  "payload": { "to": "example@gmail.com" },
  "status": "pending",
  "attempts": 0,
  "createdAt": "2026-04-02T03:50:40.769Z",
  "updatedAt": "2026-04-02T03:50:40.769Z"
}

After Worker Processes:
{
  "id": 1,
  "type": "email",
  "payload": { "to": "example@gmail.com" },
  "status": "completed",
  "attempts": 1,
  "createdAt": "2026-04-02T03:50:40.769Z",
  "updatedAt": "2026-04-02T03:53:51.768Z"
}

💻 Test API with curl
Create a job:
curl -X POST http://localhost:5000/jobs \
-H "Content-Type: application/json" \
-d '{"type":"email","payload":{"to":"example@gmail.com"}}'

Get all jobs:
curl http://localhost:5000/jobs

Get single job:
curl http://localhost:5000/jobs/1

🔄 Job Statuses

Status	Meaning
pending	Job is waiting to be processed
processing	Job is currently being processed by worker
completed	Job successfully processed
failed	Job failed, will retry based on retry logic

Retry Demo:

Worker retries failed jobs up to 3 attempts
Status updates after each attempt

🛠 NPM Scripts
# Start development server
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod

# Run worker
npm run start:worker

# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Test coverage
npm run test:cov
   
