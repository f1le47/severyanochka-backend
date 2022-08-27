const ApiError = require('../errors/ApiError');
const { Favorite, User, Product } = require('../models/models');
const favorite_productService = require('./favorite_product-service');

class FavoriteService {
  async createFavorite({ userId }) {
    const favorite = await Favorite.create({ userId });

    return favorite;
  }
  async addFavoriteProduct({ userId, productId }) {
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw ApiError.badRequest('Пользователя с таким ID не существует');
    }
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }
    const favorite = await Favorite.findOne({ where: { userId } });

    const favoriteProduct = await favorite_productService.addFavoriteProduct({
      favoriteId: favorite.id,
      productId,
    });

    return favoriteProduct;
  }
  async removeFavoriteProduct({ userId, productId }) {
    const favorite = await Favorite.findOne({ where: { userId } });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const result = await favorite_productService.removeFavoriteProduct({
      favoriteId: favorite.id,
      productId,
    });

    return result;
  }
  async getFavorites({ userId, page, amount, categoryId, min, max }) {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const favorites = await favorite_productService.getFavorites({
      favoriteId: favorite.id,
      page,
      amount,
      categoryId,
      min,
      max,
    });

    return favorites;
  }
  async getFavoritePages({ userId }) {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const amountPages = await favorite_productService.getFavoritePages({ favoriteId: favorite.id });

    return amountPages;
  }
  async getFavoriteIds({ userId }) {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const favoriteProductsIds = favorite_productService.getFavoriteIds({ favoriteId: favorite.id });

    return favoriteProductsIds;
  }
  async getFavoriteCategories({ userId }) {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const favoriteCategories = favorite_productService.getFavoriteCategories({
      favoriteId: favorite.id,
    });

    return favoriteCategories;
  }
  async getMinMaxPrices({ userId }) {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const minMaxPrices = await favorite_productService.getMinMaxPrices({ favoriteId: favorite.id });

    return minMaxPrices;
  }
}

module.exports = new FavoriteService();
