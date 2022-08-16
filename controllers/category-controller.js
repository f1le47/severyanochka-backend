const ApiError = require('../errors/ApiError');
const CategoryService = require('../services/category-service');

class CategoryController {
  async addCategory(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        next(ApiError.badRequest('Не указаны данные'));
      }

      await CategoryService.addCategory({ name });

      return res.json({ message: 'Категория успешно добавлена' });
    } catch (e) {
      next(e);
    }
  }
  async changeCategory(req, res, next) {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await CategoryService.changeCategory({ id, name });

      return res.json({ message: 'Категория успешно изменена' });
    } catch (e) {
      next(e);
    }
  }
  async deleteCategory(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.badRequest('Укажите ID'));
      }

      await CategoryService.deleteCategory({ id });

      return res.json({ message: 'Категория успешно удалена' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CategoryController();
