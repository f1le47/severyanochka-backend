const jobService = require('../services/job-service');

class JobController {
  async getJobs(req, res, next) {
    try {
      let { page, amount } = req.query;
      if (!page) {
        page = 1;
      }
      if (!amount) {
        amount = 6;
      }

      const jobs = await jobService.getJobs({ page, amount });

      return res.json({ jobs });
    } catch (e) {
      next(e);
    }
  }
  async addJob(req, res, next) {
    try {
      const { job_title, requirements, responsibilities, terms } = req.body;

      const job = await jobService.addJob({ job_title, requirements, responsibilities, terms });

      return res.json({ job, message: 'Вакансия успешно добавлена' });
    } catch (e) {
      next(e);
    }
  }
  async changeJob(req, res, next) {
    try {
      const { job_title, requirements, responsibilities, terms, id } = req.body;

      const job = await jobService.changeJob({
        job_title,
        requirements,
        responsibilities,
        terms,
        id,
      });

      return res.json({ job, message: 'Вакансия успешно изменена' });
    } catch (e) {
      next(e);
    }
  }
  async deleteJob(req, res, next) {
    try {
      const { id } = req.query;

      await jobService.deleteJob({ id });

      return res.json({ message: 'Вакансия успешно удалена' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new JobController();
