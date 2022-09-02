const ApiError = require('../errors/ApiError');
const { Category } = require('../models/models');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const CategoryDto = require('../dtos/category-dto');

class CategoryService {
  async addCategory({ name, img }) {
    const candidate = await Category.findOne({ where: { name } });
    if (candidate) {
      throw ApiError.badRequest('Категория с таким названием уже существует');
    }

    const fileName = 'categories/' + uuid.v4() + '.jpg';
    await img.mv(path.resolve(__dirname, '..', 'static', fileName));

    const category = await Category.create({ name, img: fileName });

    return category;
  }
  async changeCategory({ id, name, img }) {
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      throw ApiError.badRequest('Категории с таким ID не существует');
    }

    let fileName;
    if (!img) {
      fileName = category.img;
    } else {
      fileName = 'categories/' + uuid.v4() + '.jpg';
      await img.mv(path.resolve(__dirname, '..', 'static', fileName));
      fs.unlink(path.resolve(__dirname, '..', 'static', category.img), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const result = await category.update({ name, img: fileName });
  }
  async deleteCategory({ id }) {
    const category = await Category.findOne({ where: { id } });
    if (!category) {
      throw ApiError.badRequest('Категории с таким ID не существует');
    }

    fs.unlink(path.resolve(__dirname, '..', 'static', category.img), (err) => {
      if (err) {
        console.log(err);
      }
    });

    const result = await category.destroy();

    return result;
  }
  async getCategories() {
    const categories = await Category.findAll();

    const fullCategories = categories.map((category) => {
      const categoryDto = new CategoryDto({ category });
      return { ...categoryDto };
    });

    return fullCategories;
  }
}

module.exports = new CategoryService();
