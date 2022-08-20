const ApiError = require('../errors/ApiError');
const favoriteService = require('../services/favoriteService');

class FavoriteController {
  async addFavoriteProduct(req, res, next) {
    try {
      const { userId, productId } = req.body;
      if (!userId || !productId) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await favoriteService.addFavoriteProduct({ userId, productId });

      return res.json({ message: 'Продукт успешно добавлен в избранное' });
    } catch (e) {
      next(e);
    }
  }
  async removeFavoriteProduct(req, res, next) {
    try {
      const { id } = req.user;
      const { productId } = req.query;
      if (!productId) {
        next(ApiError.badRequest('Не указаны данные'));
      }

      await favoriteService.removeFavoriteProduct({ userId: id, productId });

      return res.json({ message: 'Продукт успешно удален из списка избранных' });
    } catch (e) {
      next(e);
    }
  }
  async getFavorites(req, res, next) {
    try {
      const { id } = req.user;

      let { page, amount } = req.query;
      !page && (page = 1);
      !amount && (amount = 6);

      const favorites = await favoriteService.getFavorites({ userId: id, page, amount });

      return res.json({ favorites });
    } catch (e) {
      next(e);
    }
  }
  async getFavoritePages(req, res, next) {
    try {
      const { id } = req.user;

      const amountPages = await favoriteService.getFavoritePages({ userId: id });

      return res.json({ amountPages });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FavoriteController();
