module.exports = class BasketProductDto {
  id;
  name;
  price;
  discount;
  amount;
  img;

  constructor({ basketProduct }) {
    this.id = basketProduct.product.id;
    this.name = basketProduct.product.name;
    this.price = basketProduct.product.price;
    this.discount = basketProduct.product.discount;
    this.amount = basketProduct.amount;
    this.img = basketProduct.product.img;
  }
};
