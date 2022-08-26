const CategoryDto = require('../dtos/category-dto');
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
  async getFavorites({ favoriteId, page, amount, categoryId }) {
    const skip = (Number(page) - 1) * Number(amount);
    let favoriteProducts;
    let amountFavoriteProducts;
    if (categoryId) {
      favoriteProducts = await FavoriteProduct.findAll({
        where: { favoriteId },
        offset: skip,
        limit: Number(amount),
        include: [
          {
            model: Product,
            where: { categoryId },
            include: [{ model: Brand }, { model: Category }],
          },
        ],
      });
      amountFavoriteProducts = await FavoriteProduct.count({ where: { favoriteId } });
    } else {
      favoriteProducts = await FavoriteProduct.findAll({
        where: { favoriteId },
        offset: skip,
        limit: Number(amount),
        include: [{ model: Product, include: [{ model: Brand }, { model: Category }] }],
      });
      amountFavoriteProducts = await FavoriteProduct.count({ where: { favoriteId } });
    }

    const fullFavoriteProducts = [];
    favoriteProducts.forEach((favoriteProduct) => {
      const favoriteDto = new FavoriteProductDto({ favoriteProduct });
      fullFavoriteProducts.push({ ...favoriteDto });
    });

    return { amountFavoriteProducts, fullFavoriteProducts };
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
  async getFavoriteCategories({ favoriteId }) {
    const favoriteProducts = await FavoriteProduct.findAll({
      where: { favoriteId },
      include: { model: Product, include: { model: Category } },
    });

    const favoriteCategories = [];
    favoriteProducts.forEach((favoriteProduct) => {
      const category = new CategoryDto({ favoriteProduct });
      let alreadyInArr = false;
      favoriteCategories.forEach((favoriteCategory) => {
        if (favoriteCategory.id === category.id) {
          alreadyInArr = true;
        }
      });
      !alreadyInArr && favoriteCategories.push({ ...category });
    });

    return favoriteCategories;
  }
}

module.exports = new FavoriteProductService();
