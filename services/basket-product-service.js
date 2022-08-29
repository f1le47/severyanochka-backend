const ApiError = require('../errors/ApiError');
const { BasketProduct, Product, Discount } = require('../models/models');
const BasketProductDto = require('../dtos/basket-product-dto');

class BasketProductService {
  async addBasketProduct({ basketId, productId }) {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    const basketProduct = await BasketProduct.findOne({ where: { basketId, productId } });
    let response;
    if (basketProduct) {
      response = await basketProduct.update({ amount: basketProduct.amount + 1 });
    } else {
      response = await BasketProduct.create({ basketId, productId });
    }

    return response;
  }
  async removeBasketProduct({ basketId, productId }) {
    const basketProduct = await BasketProduct.findOne({ where: { basketId, productId } });
    if (!basketProduct) {
      throw ApiError.badRequest('Такого продукта нет в корзине');
    }

    let response;
    if (basketProduct.amount > 1) {
      response = await basketProduct.update({ amount: basketProduct.amount - 1 });
    } else if (basketProduct.amount === 1) {
      response = await basketProduct.destroy();
    }

    return response;
  }
  async getBasketProducts({ basketId }) {
    const basketProducts = await BasketProduct.findAll({
      where: { basketId },
      include: [{ model: Product, include: [{ model: Discount }] }],
    });

    const fullBasketProducts = [];
    basketProducts.forEach((basketProduct) => {
      const basketProductDto = new BasketProductDto({ basketProduct });

      fullBasketProducts.push({ ...basketProductDto });
    });

    return fullBasketProducts;
  }
  async getAmountBasketProducts({ basketId }) {
    const amountBasketProducts = await BasketProduct.count({ where: { basketId } });

    return amountBasketProducts;
  }
}

module.exports = new BasketProductService();
