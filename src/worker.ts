import { DataSource, LessThanOrEqual, IsNull } from 'typeorm';
import { Job, JobStatus } from './jobs/job.entity';
import { config } from 'dotenv';

config(); // load .env

const RETRY_BACKOFF_MS = [1000, 5000, 15000];

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Job],
  synchronize: false, // production-safe; update schema via migration
});

function getBackoffMs(attempt: number) {
  const index = Math.max(0, Math.min(RETRY_BACKOFF_MS.length - 1, attempt - 1));
  return RETRY_BACKOFF_MS[index];
}

async function processJob(job: Job) {
  const maxAttempts = job.maxAttempts ?? 3;
  const nextAttempt = job.attempts + 1;
  console.log(`Processing job ${job.id} of type ${job.type} (attempt ${nextAttempt}/${maxAttempts})`);

  try {
    // Simulate job processing (replace with actual logic)
    await new Promise((res) => setTimeout(res, 2000));

    job.attempts = nextAttempt;
    job.status = JobStatus.COMPLETED;
    job.nextRunAt = null;

    await AppDataSource.manager.save(job);
    console.log(`Job ${job.id} completed on attempt ${job.attempts}`);
  } catch (err) {
    job.attempts = nextAttempt;

    if (nextAttempt >= maxAttempts) {
      job.status = JobStatus.FAILED;
      job.nextRunAt = null;
      await AppDataSource.manager.save(job);
      console.error(`Job ${job.id} failed permanently after ${job.attempts} attempts:`, err);
    } else {
      const backoffMs = getBackoffMs(nextAttempt);
      const nextRunAt = new Date(Date.now() + backoffMs);

      job.status = JobStatus.PENDING;
      job.nextRunAt = nextRunAt;

      await AppDataSource.manager.save(job);
      console.warn(
        `Job ${job.id} failed on attempt ${job.attempts}. Retrying in ${backoffMs / 1000}s at ${nextRunAt.toISOString()}.`,
        err,
      );
    }
  }
}

async function runWorker() {
  await AppDataSource.initialize();
  console.log('Worker started...');

  setInterval(async () => {
    const now = new Date();
    const pendingJobs = await AppDataSource.manager.find(Job, {
      where: [
        { status: JobStatus.PENDING, nextRunAt: IsNull() },
        { status: JobStatus.PENDING, nextRunAt: LessThanOrEqual(now) },
      ],
    });

    if (pendingJobs.length === 0) return;

    for (const job of pendingJobs) {
      job.status = JobStatus.PROCESSING;
      await AppDataSource.manager.save(job);

      await processJob(job);
    }
  }, 3000); // check every 3 seconds
}

runWorker().catch((err) => console.error(err));