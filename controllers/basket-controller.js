const ApiError = require('../errors/ApiError');
const basketService = require('../services/basket-service');

class BasketController {
  async addBasketProduct(req, res, next) {
    try {
      const { id } = req.user;
      const { productId } = req.body;
      if (!productId) {
        return next(ApiError.badRequest('Укажите ID продукта'));
      }

      await basketService.addBasketProduct({ userId: id, productId });

      return res.json({ message: 'Продукт успешно добавлен в корзину' });
    } catch (e) {
      next(e);
    }
  }
  async removeBasketProduct(req, res, next) {
    try {
      const { id } = req.user;
      const { productId } = req.query;
      if (!productId) {
        return next(ApiError.badRequest('Укажите ID продукта'));
      }

      await basketService.removeBasketProduct({ userId: id, productId });

      return res.json({ message: 'Продукт успешно удален из корзины' });
    } catch (e) {
      next(e);
    }
  }
  async getBasketProducts(req, res, next) {
    try {
      const { id } = req.user;

      const basketProducts = await basketService.getBasketProducts({ userId: id });

      return res.json({ basketProducts });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BasketController();
