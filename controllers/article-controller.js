const ApiError = require('../errors/ApiError');
const articleService = require('../services/article-service');

class ArticleController {
  async getArticle(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.badRequest('Не указан ID статьи'));
      }

      const article = await articleService.getArticle({ id });

      return res.json({ article });
    } catch (e) {
      next(e);
    }
  }
  async createArticle(req, res, next) {
    try {
      const { title, articleText } = req.body;
      const { img } = req.files;
      if (!title || !articleText || !img) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await articleService.createArticle({ title, articleText, img });

      return res.json({ message: 'Статья успешно добавлена' });
    } catch (e) {
      next(e);
    }
  }
  async changeArticle(req, res, next) {
    try {
      const { id, title, articleText } = req.body;
      const { img } = req.files;
      if (!id || !title || !articleText || !img) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await articleService.changeArticle({ id, title, articleText, img });

      return res.json({ message: 'Статья успешно изменена' });
    } catch (e) {
      next(e);
    }
  }
  async deleteArticle(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await articleService.deleteArticle({ id });

      return res.json({ message: 'Статья успешно удалена' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ArticleController();
