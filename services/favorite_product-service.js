const FavoriteProductDto = require('../dtos/favorite-dto');
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
  async getFavorites({ favoriteId }) {
    const favoriteProducts = await FavoriteProduct.findAll({
      where: { favoriteId },
      include: [{ model: Product, include: [{ model: Brand }, { model: Category }] }],
    });

    const fullFavoriteProducts = [];
    favoriteProducts.forEach((favoriteProduct) => {
      const favoriteDto = new FavoriteProductDto({ favoriteProduct });
      fullFavoriteProducts.push({ ...favoriteDto });
    });

    return fullFavoriteProducts;
  }
}

module.exports = new FavoriteProductService();
