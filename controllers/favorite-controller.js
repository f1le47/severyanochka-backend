const ApiError = require('../errors/ApiError');
const favoriteService = require('../services/favoriteService');

class FavoriteController {
  async addFavoriteProduct(req, res, next) {
    try {
      const { productId } = req.body;
      const { id } = req.user;
      if (!productId) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      const favoriteProduct = await favoriteService.addFavoriteProduct({ userId: id, productId });

      return res.json({ message: 'Продукт успешно добавлен в избранное', favoriteProduct });
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

      const favoriteProduct = await favoriteService.removeFavoriteProduct({
        userId: id,
        productId,
      });

      return res.json({ message: 'Продукт успешно удален из списка избранных', favoriteProduct });
    } catch (e) {
      next(e);
    }
  }
  async getFavorites(req, res, next) {
    try {
      const { id } = req.user;

      let { page, amount, categoryId, min, max } = req.query;
      !page && (page = 1);
      !amount && (amount = 6);

      const favorites = await favoriteService.getFavorites({
        userId: id,
        page,
        amount,
        categoryId,
        min,
        max,
      });

      return res.json({
        favoriteProducts: favorites.fullFavoriteProducts,
        amountFavoriteProducts: favorites.amountFavoriteProducts,
        minPrice: favorites.minPrice,
        maxPrice: favorites.maxPrice,
      });
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
  async favoriteProductsIds(req, res, next) {
    try {
      const { id } = req.user;

      const favoriteProductIds = await favoriteService.getFavoriteIds({ userId: id });

      return res.json({ favoriteProductIds });
    } catch (e) {
      next(e);
    }
  }
  async getFavoriteCategories(req, res, next) {
    try {
      const { id } = req.user;

      const favoriteCategories = await favoriteService.getFavoriteCategories({ userId: id });

      return res.json({ favoriteCategories });
    } catch (e) {
      next(e);
    }
  }
  async getMinMaxPrices(req, res, next) {
    try {
      const { id } = req.user;

      const minMaxPrices = await favoriteService.getMinMaxPrices({ userId: id });

      return res.json({ minPrice: minMaxPrices.minPrice, maxPrice: minMaxPrices.maxPrice });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new FavoriteController();
