Job Queue System

A simple job queue system built with NestJS, PostgreSQL, and Docker, featuring asynchronous job processing with a worker and retry logic.

Features
Create and manage jobs via REST API
Asynchronous processing using a worker
Retry logic for failed jobs
Dockerized development environment
Environment-based configuration
Architecture
[API Container] ---> [PostgreSQL Container] <--- [Worker Container]
API: Runs on port 5000, handles job creation and management
Worker: Continuously polls pending jobs and updates their status
PostgreSQL: Stores all job data
Docker Compose: Orchestrates all services
Project Structure
.
├── src/
│   ├── main.ts       # API entry point
│   ├── worker.ts     # Worker entry point
│   └── modules/      # NestJS modules (jobs, auth, workers, etc.)
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
Installation & Running Locally
Clone the repository
git clone <your-github-repo-url>
cd job-queue-system
Create .env file
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=postgres
DB_NAME=job_queue
JWT_SECRET=supersecret
Start Docker containers
docker-compose up --build
API will be available at http://localhost:5000
Worker runs in the background and processes jobs
Stop containers
docker-compose down
API Usage
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

Response After Worker Processes:

{
  "id": 1,
  "type": "email",
  "payload": { "to": "example@gmail.com" },
  "status": "completed",
  "attempts": 1,
  "createdAt": "2026-04-02T03:50:40.769Z",
  "updatedAt": "2026-04-02T03:53:51.768Z"
}
NPM Scripts
# development
npm run start

# watch mode
npm run start:dev

# production
npm run start:prod

# run worker
npm run start:worker

# unit tests
npm run test

# e2e tests
npm run test:e2e

# test coverage
npm run test:cov
License

MIT © 2026
