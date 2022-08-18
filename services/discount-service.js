const ApiError = require('../errors/ApiError');
const { Discount, Product } = require('../models/models');

class DiscountService {
  async addDiscountFromProduct({ discount, priceWithCard, productId }) {
    const candidate = await Discount.findOne({ where: { productId } });
    if (candidate) {
      throw ApiError.badRequest('Скидка для этого продукта уже существует');
    }

    const result = await Discount.create({ discount, priceWithCard, productId });
    return result;
  }
  async addDiscount({ discount, priceWithCard, productId }) {
    const candidate = await Discount.findOne({ where: { productId } });
    if (candidate) {
      throw ApiError.badRequest('Скидка для этого продукта уже существует');
    }
    const product = await Product.findOne({ id: productId });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    const result = await Discount.create({ discount, priceWithCard, productId });
    await product.update({ isDiscount: true });
  }
  async changeDiscount({ productId, discount, priceWithCard }) {
    const discountField = await Discount.findOne({ productId });
    if (!discountField) {
      throw ApiError.badRequest('У продукта с таким ID нет скидки');
    }

    const result = await discountField.update({ discount, priceWithCard });

    return result;
  }
  async deleteDiscountFromProduct({ productId }) {
    const discount = await Discount.findOne({ productId });

    const result = await discount.destroy();
    return result;
  }
  async deleteDiscount({ productId }) {
    const discount = await Discount.findOne({ productId });
    if (!discount) {
      throw ApiError.badRequest('У этого продукта нет скидки');
    }

    const result = await discount.destroy();
    const product = await Product.findOne({ where: { id: productId } });
    await product.update({ isDiscount: false });

    return result;
  }
}

module.exports = new DiscountService();
