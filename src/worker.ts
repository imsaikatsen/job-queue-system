import { DataSource } from 'typeorm';
import { Job, JobStatus } from './jobs/job.entity';
import { config } from 'dotenv';

config(); // load .env

// Setup TypeORM data source
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Job],
  synchronize: false, // production-safe
});

async function processJob(job: Job) {
  console.log(`Processing job ${job.id} of type ${job.type}`);
  try {
    // Simulate job processing (replace with actual logic)
    await new Promise((res) => setTimeout(res, 2000));

    // Mark as completed
    job.status = JobStatus.COMPLETED;
    job.attempts += 1;
    await AppDataSource.manager.save(job);

    console.log(`Job ${job.id} completed!`);
  } catch (err) {
    console.error(`Job ${job.id} failed:`, err);
    job.status = JobStatus.FAILED;
    job.attempts += 1;
    await AppDataSource.manager.save(job);
  }
}

async function runWorker() {
  await AppDataSource.initialize();
  console.log('Worker started...');

  setInterval(async () => {
    const pendingJobs = await AppDataSource.manager.find(Job, {
      where: { status: JobStatus.PENDING },
    });

    if (pendingJobs.length === 0) return;

    for (const job of pendingJobs) {
      // Mark as processing
      job.status = JobStatus.PROCESSING;
      await AppDataSource.manager.save(job);

      // Process job
      await processJob(job);
    }
  }, 3000); // check every 3 seconds
}

runWorker().catch((err) => console.error(err));