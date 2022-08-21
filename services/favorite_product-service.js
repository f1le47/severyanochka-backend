const FavoriteProductDto = require('../dtos/favorite-dto');
const FavoriteProductIdDto = require('../dtos/favorite-product-id-dto');
const ApiError = require('../errors/ApiError');
const { FavoriteProduct, Product, Brand, Category } = require('../models/models');

class FavoriteProductService {
  async addFavoriteProduct({ favoriteId, productId }) {
    const candidate = await FavoriteProduct.findOne({ where: { favoriteId, productId } });
    if (candidate) {
      throw ApiError.badRequest('Этот продукт уже в списке избранных');
    }

    const favorite = await FavoriteProduct.create({ favoriteId, productId });

    return favorite;
  }
  async removeFavoriteProduct({ favoriteId, productId }) {
    const favoriteProduct = await FavoriteProduct.findOne({ where: { favoriteId, productId } });
    if (!favoriteProduct) {
      throw ApiError.badRequest('Такого продукта нет в списке избранных');
    }

    const result = await favoriteProduct.destroy();

    return result;
  }
  async getFavorites({ favoriteId, page, amount }) {
    const skip = (page - 1) * amount;
    const favoriteProducts = await FavoriteProduct.findAll({
      where: { favoriteId },
      offset: skip,
      limit: Number(amount),
      include: [{ model: Product, include: [{ model: Brand }, { model: Category }] }],
    });

    const fullFavoriteProducts = [];
    favoriteProducts.forEach((favoriteProduct) => {
      const favoriteDto = new FavoriteProductDto({ favoriteProduct });
      fullFavoriteProducts.push({ ...favoriteDto });
    });

    return fullFavoriteProducts;
  }
  async getFavoritePages({ favoriteId }) {
    const amountPages = await FavoriteProduct.count({ where: { favoriteId } });

    return amountPages;
  }
  async getFavoriteIds({ favoriteId }) {
    const favoriteProductsIds = [];
    const favoriteProducts = await FavoriteProduct.findAll({ where: { favoriteId } });

    favoriteProducts.forEach((favoriteProduct) => {
      const favoriteProductIdDto = new FavoriteProductIdDto({ favoriteProduct });
      favoriteProductsIds.push({ ...favoriteProductIdDto });
    });

    return favoriteProductsIds;
  }
}

module.exports = new FavoriteProductService();
