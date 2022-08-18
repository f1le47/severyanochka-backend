const ProductDto = require('./product-dto');

module.exports = class DiscountProductDto extends ProductDto {
  discount;

  constructor({ product, discount }) {
    super({ product });

    this.discount = discount.discount;
  }
};
