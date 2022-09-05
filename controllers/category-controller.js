const ApiError = require('../errors/ApiError');
const categoryService = require('../services/category-service');

class CategoryController {
  async addCategory(req, res, next) {
    try {
      const { img } = req.files;
      const { name } = req.body;
      if (!name) {
        next(ApiError.badRequest('Не указаны данные'));
      }

      await categoryService.addCategory({ name, img });

      return res.json({ message: 'Категория успешно добавлена' });
    } catch (e) {
      next(e);
    }
  }
  async changeCategory(req, res, next) {
    try {
      const { img } = req.files;
      const { id, name } = req.body;
      if (!id || !name) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await categoryService.changeCategory({ id, name, img });

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

      await categoryService.deleteCategory({ id });

      return res.json({ message: 'Категория успешно удалена' });
    } catch (e) {
      next(e);
    }
  }
  async getCategories(req, res, next) {
    try {
      const categories = await categoryService.getCategories();

      return res.json({ categories });
    } catch (e) {
      next(e);
    }
  }
  async getByCategoryId(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return ApiError.badRequest('Укажите ID категории');
      }

      const productsById = await categoryService.getByCategoryId({ id });

      return res.json({ productsById });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new CategoryController();
