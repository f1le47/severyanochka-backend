const ApiError = require('../errors/ApiError');
const { Favorite, User, Product } = require('../models/models');
const favoriteProductService = require('./favorite-product-service');

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

    const favoriteProduct = await favoriteProductService.addFavoriteProduct({
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

    const result = await favoriteProductService.removeFavoriteProduct({
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

    const favorites = await favoriteProductService.getFavorites({
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

    const amountPages = await favoriteProductService.getFavoritePages({ favoriteId: favorite.id });

    return amountPages;
  }
  async getFavoriteIds({ userId }) {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const favoriteProductsIds = favoriteProductService.getFavoriteIds({ favoriteId: favorite.id });

    return favoriteProductsIds;
  }
  async getFavoriteCategories({ userId }) {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const favoriteCategories = favoriteProductService.getFavoriteCategories({
      favoriteId: favorite.id,
    });

    return favoriteCategories;
  }
  async getMinMaxPrices({ userId }) {
    const favorite = await Favorite.findOne({ userId });
    if (!favorite) {
      throw ApiError.badRequest('У пользователя нет избранных');
    }

    const minMaxPrices = await favoriteProductService.getMinMaxPrices({ favoriteId: favorite.id });

    return minMaxPrices;
  }
}

module.exports = new FavoriteService();
