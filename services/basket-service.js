const ApiError = require('../errors/ApiError');
const { Basket } = require('../models/models');
const basketProductService = require('./basket-product-service');

class BasketService {
  async createBasket({ userId }) {
    const candidate = await Basket.findOne({ userId });
    if (candidate) {
      throw ApiError.badRequest('У этого пользователя уже есть корзина');
    }

    await Basket.create({ userId });
  }
  async addBasketProduct({ userId, productId }) {
    const basket = await Basket.findOne({ where: { userId } });

    await basketProductService.addBasketProduct({ basketId: basket.id, productId });
  }
  async removeBasketProduct({ userId, productId }) {
    try {
      const basket = await Basket.findOne({ userId });

      await basketProductService.removeBasketProduct({ basketId: basket.id, productId });
    } catch (e) {
      throw e;
    }
  }
  async getBasketProducts({ userId }) {
    const basket = await Basket.findOne({ userId });

    const basketProducts = await basketProductService.getBasketProducts({ basketId: basket.id });

    return basketProducts;
  }
}

module.exports = new BasketService();
