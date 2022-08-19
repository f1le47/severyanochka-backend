const ApiError = require('../errors/ApiError');
const { Product, Discount, Brand, Category } = require('../models/models');
const ProductDto = require('../dtos/product-dto');
const DiscountProductDto = require('../dtos/discount-product-dto');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const discountService = require('./discount-service');

class ProductService {
  async getProduct(id) {
    const product = await Product.findOne({
      where: { id },
      include: [{ model: Brand }, { model: Category }, { model: Discount }],
    });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    const productDto = new ProductDto({ product });

    return { ...productDto };
  }

  async addProduct({ price, name, weight, brandId, img, categoryId, discount, priceWithCard }) {
    const candidate = await Product.findOne({ where: { name } });
    if (candidate) {
      throw ApiError.badRequest('Продукт с таким названием уже существует');
    }

    const fileName = 'products/' + uuid.v4() + '.jpg';
    await img.mv(path.resolve(__dirname, '..', 'static', fileName));

    const product = await Product.create({
      name,
      price,
      weight,
      brandId,
      categoryId,
      img: fileName,
    });

    if (discount) {
      await discountService.addDiscountFromProduct({
        discount,
        priceWithCard,
        productId: product.id,
      });
      product.update({ isDiscount: true });
    }

    return product;
  }

  async changeProduct({ price, name, id, weight, brandId, img, categoryId }) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    let fileName;
    if (!img) {
      fileName = product.img;
    } else {
      fileName = 'products/' + uuid.v4() + '.jpg';
      await img.mv(path.resolve(__dirname, '..', 'static', fileName));
      fs.unlink(path.resolve(__dirname, '..', 'static', product.img), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const result = await product.update({
      name,
      price,
      weight,
      brandId,
      categoryId,
      img: fileName,
    });

    return result;
  }

  async deleteProduct(id) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    if (product.isDiscount === true) {
      discountService.deleteDiscountFromProduct({ productId: product.id });
    }

    fs.unlink(path.resolve(__dirname, '..', 'static', product.img), (err) => {
      if (err) {
        console.log(err);
      }
    });
    const result = await product.destroy();
    return result;
  }

  async getProducts(page, amount) {
    const skip = Number(page) * Number(amount) - Number(amount);
    const products = await Product.findAll({
      offset: skip,
      limit: Number(amount),
      include: [{ model: Brand }, { model: Category }, { model: Discount }],
    });
    if (products.length === 0) {
      throw ApiError.badRequest('Продукты еще не добавлены');
    }

    const fullProducts = [];
    products.forEach((product) => {
      const productDto = new ProductDto({ product });
      fullProducts.push({ ...productDto });
    });

    return fullProducts;
  }
  async getDiscountProducts({ page, amount }) {
    const skip = Number(page) * Number(amount) - Number(amount);
    const products = await Product.findAll({
      offset: skip,
      limit: Number(amount),
      where: { isDiscount: true },
      include: [{ model: Brand }, { model: Category }, { model: Discount }],
    });

    const fullDiscountProducts = [];
    for (const product of products) {
      const discountProductDto = new ProductDto({ product });
      fullDiscountProducts.push({ ...discountProductDto });
    }

    return fullDiscountProducts;
  }
  async getLatestProducts({ page, amount }) {
    const skip = Number(page) * Number(amount) - Number(amount);
    const products = await Product.findAll({
      offset: skip,
      limit: Number(amount),
      order: [['createdAt', 'DESC']],
      include: [{ model: Brand }, { model: Category }, { model: Discount }],
    });

    if (products.length === 0) {
      throw ApiError.badRequest('Продукты еще не добавлены');
    }

    const fullProducts = [];
    products.forEach((product) => {
      const productDto = new ProductDto({ product });
      fullProducts.push({ ...productDto });
    });

    return fullProducts;
  }
}

module.exports = new ProductService();
