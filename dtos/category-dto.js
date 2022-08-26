module.exports = class CategoryDto {
  id;
  name;

  constructor({ favoriteProduct }) {
    this.id = favoriteProduct.product.category.id;
    this.name = favoriteProduct.product.category.name;
  }
};
