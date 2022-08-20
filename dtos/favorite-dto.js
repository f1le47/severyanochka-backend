const ProductDto = require('./product-dto');

module.exports = class FavoriteProductDto extends ProductDto {
  constructor({ favoriteProduct }) {
    super({ product: favoriteProduct.product });
  }
};
