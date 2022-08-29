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

      const basketProduct = await basketService.addBasketProduct({ userId: id, productId });

      return res.json({ message: 'Продукт успешно добавлен в корзину', basketProduct });
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

      const basketProduct = await basketService.removeBasketProduct({ userId: id, productId });

      return res.json({ message: 'Продукт успешно удален из корзины', basketProduct });
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
  async getAmountBasketProducts(req, res, next) {
    try {
      const { id } = req.user;

      const amountBasketProducts = await basketService.getAmountBasketProducts({ userId: id });

      return res.json({ amountBasketProducts });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new BasketController();
