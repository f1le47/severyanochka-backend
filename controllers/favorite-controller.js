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
      const { userId, productId } = req.query;
      if (!userId || !productId) {
        next(ApiError.badRequest('Не указаны данные'));
      }

      await favoriteService.removeFavoriteProduct({ userId, productId });

      return res.json({ message: 'Продукт успешно удален из списка избранных' });
    } catch (e) {
      next(e);
    }
  }
  async getFavorites(req, res, next) {
    try {
      const { id } = req.user;
      if (!id) {
        return next(ApiError.badRequest('Укажите ID пользователя'));
      }

      const favorites = await favoriteService.getFavorites({ userId: id });

      return res.json({ favorites });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FavoriteController();
