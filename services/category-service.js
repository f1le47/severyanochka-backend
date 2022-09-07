const ApiError = require('../errors/ApiError');
const { Category, Product, Discount, Brand } = require('../models/models');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const CategoryDto = require('../dtos/category-dto');
const ProductDto = require('../dtos/product-dto');
const { Op } = require('sequelize');

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
  async getByCategoryId({ id, page, amount, min, max }) {
    const skip = (page - 1) * amount;
    let category;
    if (min && max) {
      category = await Category.findOne({
        where: { id },
        offset: skip,
        limit: amount,
        include: [
          {
            model: Product,
            where: { price: { [Op.between]: [min, max] } },
            include: [{ model: Discount }, { model: Brand }, { model: Category }],
          },
        ],
      });
    } else {
      category = await Category.findOne({
        where: { id },
        offset: skip,
        limit: amount,
        include: [
          { model: Product, include: [{ model: Discount }, { model: Brand }, { model: Category }] },
        ],
      });
    }

    let amountProducts = 0;

    const fullProducts = [];
    category.products.forEach((product) => {
      amountProducts = amountProducts + 1;
      const productDto = new ProductDto({ product });
      fullProducts.push({ ...productDto });
    });

    return { fullProducts, amountProducts };
  }
  async getMinMaxPrices({ id }) {
    const category = await Category.findOne({ where: { id }, include: [{ model: Product }] });

    let minPrice = 0;
    let maxPrice = 0;

    category.products.forEach((product) => {
      const price = parseFloat(product.price);
      if (minPrice > price || minPrice === 0) {
        minPrice = price;
      }
      if (maxPrice < price || maxPrice === 0) {
        maxPrice = price;
      }
    });

    return { minPrice, maxPrice };
  }
}

module.exports = new CategoryService();
