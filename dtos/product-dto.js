module.exports = class ProductDto {
  id;
  name;
  price;
  weight;
  isDiscount;
  brandId;
  categoryId;
  rating;
  img;

  constructor({ product }) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.weight = product.weight;
    this.isDiscount = product.isDiscount;
    this.brandId = product.brandId;
    this.categoryId = product.categoryId;
    this.rating = product.rating;
    this.img = product.img;
  }
};
