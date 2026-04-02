import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { JobsService } from './jobs.service';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  create(@Body() body: { type: string; payload: any; maxAttempts?: number }) {
    return this.jobsService.createJob(
      body.type,
      body.payload,
      body.maxAttempts ?? 3,
    );
  }

  @Get()
  findAll() {
    return this.jobsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jobsService.findOne(Number(id));
  }
}