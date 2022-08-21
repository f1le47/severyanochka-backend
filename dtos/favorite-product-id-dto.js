module.exports = class FavoriteProductIdDto {
  productId;

  constructor({ favoriteProduct }) {
    this.productId = favoriteProduct.productId;
  }
};
