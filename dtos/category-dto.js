module.exports = class CategoryDto {
  id;
  name;
  img;

  constructor({ category }) {
    this.id = category.id;
    this.name = category.name;
    this.img = category.img;
  }
};
