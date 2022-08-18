module.exports = class ProductDto {
  id;
  name;
  price;
  price_with_card;
  weight;
  brand;
  category;
  rating;
  img;
  discount;

  constructor({ product }) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.price_with_card = product.price_with_card;
    this.weight = product.weight;
    this.category = product.category;
    this.rating = product.rating;
    this.brand = product.brand;
    this.img = product.img;
    this.discount = product.discount;
  }
};
