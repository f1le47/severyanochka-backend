module.exports = class JobDto {
  id;
  job_title;
  requirements;
  responsibilities;
  terms;

  constructor({job}) {
    this.id = job.id;
    this.job_title = job.job_title;
    this.requirements = job.requirements;
    this.responsibilities = job.responsibilities;
    this.terms = job.terms;
  }
};
