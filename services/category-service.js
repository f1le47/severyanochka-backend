const ApiError = require('../errors/ApiError');
const { Category } = require('../models/models');

class CategoryService {
  async addCategory({ name }) {
    const candidate = await Category.findOne({ where: { name } });
    if (candidate) {
      throw ApiError.badRequest('Категория с таким названием уже существует');
    }

    const category = await Category.create({ name });

    return category;
  }
  async changeCategory({ id, name }) {
    const category = await Category.findOne({ id });
    if (!category) {
      throw ApiError.badRequest('Категории с таким ID не существует');
    }

    const result = await category.update({ name });

    return result;
  }
  async deleteCategory({ id }) {
    const category = await Category.findOne({ id });
    if (!category) {
      throw ApiError.badRequest('Категории с таким ID не существует');
    }

    const result = await category.destroy();

    return result;
  }
}

module.exports = new CategoryService();
