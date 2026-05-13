# 🚀 Job Queue System

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green)](https://nodejs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-v10-orange)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-24-blue?logo=docker)](https://www.docker.com/)

---

## 📌 Overview

A lightweight **asynchronous job processing system** built with **NestJS**, **PostgreSQL**, and **Docker**.

This project demonstrates how backend systems handle:

- Background job execution  
- Retry mechanisms  
- Worker-based architecture  
- State-driven processing  

> ⚠️ Built from first principles without using external queue frameworks like BullMQ, Kafka, or RabbitMQ.

---

## 🎯 Purpose of This Project

This system was built to deeply understand:

- How job queues work internally  
- How workers process jobs asynchronously  
- How retry and scheduling logic works  
- How state transitions ensure consistency  
- Tradeoffs of database-backed queue systems  

---

## 🏗 Architecture


API Service → PostgreSQL ← Worker Service


| Component | Responsibility |
|------------|----------------|
| API | Creates and manages jobs |
| Worker | Processes jobs asynchronously |
| PostgreSQL | Stores job state and metadata |
| Docker | Local environment orchestration |

---

## 🔄 Job Lifecycle (State Machine)


PENDING → PROCESSING → COMPLETED
↓
FAILED → RETRY → PENDING


| State      | Meaning                  |
|------------|--------------------------|
| PENDING    | Waiting for execution    |
| PROCESSING | Currently being executed |
| COMPLETED  | Successfully finished     |
| FAILED     | Max retries exceeded      |

---

## 🔁 Retry Mechanism

### Strategy

The system implements a controlled retry mechanism using exponential backoff.

Each job tracks:
- `attempts`
- `maxAttempts`
- `nextRunAt`

---

### Backoff Strategy

| Attempt      | Delay |
|--------------|------|
| 1st retry    | 1s   |
| 2nd retry    | 5s   |
| 3rd retry    | 15s  |

### RETRY_BACKOFF_MS = [1000, 5000, 15000];
Purpose

Prevents:

retry storms
system overload
repeated failure loops
⚙ Worker Design

The worker runs independently and:

Polls database every 3 seconds
Fetches PENDING jobs
Marks job as PROCESSING
Executes job logic
Updates job state

⚠ Known Limitations
1. Database Polling
Continuous DB queries
Not scalable for high throughput systems
2. No Distributed Locking
Multiple workers may process same job
3. Worker Crash Recovery Gap
PROCESSING jobs may get stuck if worker fails
4. No Observability Layer
Only console logging


🧠 Key Engineering Concepts Demonstrated

Asynchronous system design
Background job processing
State machine modeling
Retry & failure handling
Worker-based architecture
Database-backed scheduling
System design tradeoffs


🚀 Setup Instructions
```bash
1. Clone repository
git clone <repo-url>
cd job-queue-system
2. Environment variables
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=job_queue
JWT_SECRET=supersecret
4. Start system
docker-compose up --build
API → http://localhost:5000
Worker runs in background
5. Stop system
docker-compose down
```
📬 API
Create Job
POST /jobs
```json
{
  "type": "email",
  "payload": {
    "to": "example@gmail.com"
  }
}

```
Get Jobs
GET /jobs
GET /jobs/:id

💻 Example Requests
Create job
curl -X POST http://localhost:5000/jobs \
 "Content-Type: application/json" 
```json
 {"type":"email","payload":{"to":"example@gmail.com"}}
```
Get all jobs
curl http://localhost:5000/jobs
Get single job
curl http://localhost:5000/jobs/1
🛠 Scripts
npm run start        # start server
npm run start:dev    # development mode
npm run start:prod   # production mode
npm run start:worker # worker process
npm run test         # unit tests
npm run test:e2e     # e2e tests
npm run test:cov     # coverage

📌 Summary

This project is a foundational backend engineering system built from first principles to understand how job queues, retry systems, and worker-based architectures work internally.

It focuses on:

core system design, reliability thinking, and asynchronous processing fundamentals.
