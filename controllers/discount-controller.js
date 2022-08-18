const ApiError = require('../errors/ApiError');
const discountService = require('../services/discount-service');

class DiscountController {
  async addDiscount(req, res, next) {
    try {
      const { discount, priceWithCard, productId } = req.body;
      if (!discount || !priceWithCard || !productId) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await discountService.addDiscount({ discount, priceWithCard, productId });

      return res.json({ message: 'Скидка успешно добавлена' });
    } catch (e) {
      next(e);
    }
  }
  async changeDiscount(req, res, next) {
    try {
      const { productId, discount, priceWithCard } = req.body;
      if (!productId || !discount || !priceWithCard) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await discountService.changeDiscount({ productId, discount, priceWithCard });

      return res.json({ message: 'Скидка успешно изменена' });
    } catch (e) {
      next(e);
    }
  }
  async deleteDiscount(req, res, next) {
    try {
      const { productId } = req.query;
      if (!productId) {
        return ApiError.badRequest('Укажите ID товара');
      }

      await discountService.deleteDiscount({ productId });

      return res.json({ message: 'Скидка успешно удалена' });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new DiscountController();
