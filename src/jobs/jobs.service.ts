import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Job, JobStatus } from './job.entity';

@Injectable()
export class JobsService {
  constructor(
    @InjectRepository(Job)
    private jobRepo: Repository<Job>,
  ) {}

  async createJob(type: string, payload: any, maxAttempts = 3) {
    const job = this.jobRepo.create({
      type,
      payload,
      status: JobStatus.PENDING,
      attempts: 0,
      maxAttempts,
      nextRunAt: new Date(),
    });

    return this.jobRepo.save(job);
  }

  async findAll() {
    return this.jobRepo.find();
  }

  async findOne(id: number) {
    return this.jobRepo.findOneBy({ id });
  }
}