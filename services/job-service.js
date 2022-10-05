const ApiError = require('../errors/ApiError');
const { Job } = require('../models/models');
const JobDto = require('../dtos/job-dto');

class JobService {
  async getJobs({ page, amount }) {
    const skip = Number(page) * Number(amount) - Number(amount);

    const jobs = await Job.findAll({ offset: skip, limit: Number(amount) });
    if (jobs.length === 0) {
      throw ApiError.internal('Вакансий пока что нет');
    }

    const fullJobs = jobs.map((job) => {
      const jobDto = new JobDto({ job });
      return jobDto;
    });

    return fullJobs;
  }
  async addJob({ job_title, requirements, responsibilities, terms }) {
    const candidate = await Job.findOne({ where: { job_title } });
    if (candidate) {
      throw ApiError.badRequest('Такая вакансия уже существует');
    }

    const job = await Job.create({
      job_title,
      requirements,
      responsibilities,
      terms,
    });

    return job;
  }
  async changeJob({ job_title, requirements, responsibilities, terms, id }) {
    const job = await Job.findOne({ where: { id } });
    if (!job) {
      throw ApiError.badRequest('Вакансии с таким ID не существует');
    }

    await job.update({
      job_title,
      requirements,
      responsibilities,
      terms,
    });

    return job;
  }
  async deleteJob({ id }) {
    const job = await Job.findOne({ where: { id } });
    if (!job) {
      throw ApiError.badRequest('Вакансии с таким ID не существует');
    }

    await job.destroy();

    return job;
  }
}

module.exports = new JobService();
