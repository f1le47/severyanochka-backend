const ProductDto = require('./product-dto');

module.exports = class FavoriteProductDto extends ProductDto {
  id;
  favoriteId;

  constructor({ favoriteProduct }) {
    super({ product: favoriteProduct.product });

    this.id = favoriteProduct.id;
    this.favoriteId = favoriteProduct.favoriteId;
  }
};
