const ApiError = require('../errors/ApiError');
const BrandService = require('../services/brand-service');

class BrandController {
  async addBrand(req, res, next) {
    try {
      const { name } = req.body;
      if (!name) {
        return ApiError.badRequest('Название бренда не может быть пустым');
      }

      await BrandService.addBrand(name);

      return res.json({ message: 'Бренд успешно добавлен' });
    } catch (e) {
      next(e);
    }
  }
  async changeBrand(req, res, next) {
    try {
      const { id, name } = req.body;
      if (!id || !name) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await BrandService.changeBrand({ id, name });

      return res.json({ message: 'Бренд успешно изменен' });
    } catch (e) {
      next(e);
    }
  }
  async deleteBrand(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await BrandService.deleteBrand({ id });

      return res.json({ message: 'Бренд успешно удален' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BrandController();
