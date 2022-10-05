const Router = require('express');
const jobController = require('../controllers/job-controller');
const router = new Router();

router.get('/jobs', jobController.getJobs);
router.post('/job', jobController.addJob);
router.put('/job', jobController.changeJob);
router.delete('/job', jobController.deleteJob);

module.exports = router;
