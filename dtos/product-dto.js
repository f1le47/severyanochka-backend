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

  constructor({ id, name, price, price_with_card, weight, category, rating, brand, img }) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.price_with_card = price_with_card;
    this.weight = weight;
    this.category = category;
    this.rating = rating;
    this.brand = brand;
    this.img = img;
  }
};
