const Router = require('express');
const router = new Router();
const articleController = require('../controllers/article-controller');

router.get('/article', articleController.getArticle);
router.post('/add-article', articleController.createArticle);
router.put('/article', articleController.changeArticle);
router.delete('/article', articleController.deleteArticle);

module.exports = router;
