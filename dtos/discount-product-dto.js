const ProductDto = require('./product-dto');

module.exports = class DiscountProductDto extends ProductDto {
  discount;
  priceWithCard;

  constructor({ product, discount }) {
    super({ product });

    this.discount = discount.discount;
    this.priceWithCard = discount.priceWithCard;
  }
};
