module.exports = class ProductDto {
  id;
  name;
  price;
  weight;
  isDiscount;
  brand;
  category;
  discount;
  rating;
  img;

  constructor({ product }) {
    this.id = product.id;
    this.name = product.name;
    this.price = parseFloat(product.price);
    this.weight = product.weight;
    this.isDiscount = product.isDiscount;
    this.brand = product.brand;
    this.category = product.category;
    this.discount = product.discount;
    this.rating = product.rating;
    this.img = product.img;
  }
};
