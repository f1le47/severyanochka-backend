const ApiError = require('../errors/ApiError');
const { Product, Discount } = require('../models/models');
const ProductDto = require('../dtos/product-dto');
const DiscountProductDto = require('../dtos/discount-product-dto');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

class ProductService {
  async getProduct(id) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    const productDto = new ProductDto({ product });

    return { ...productDto };
  }

  async addProduct({ price, name, priceWithCard, weight, brandId, img, categoryId, discount }) {
    const candidate = await Product.findOne({ where: { name } });
    if (candidate) {
      throw ApiError.badRequest('Продукт с таким названием уже существует');
    }

    const fileName = uuid.v4() + '.jpg';
    await img.mv(path.resolve(__dirname, '..', 'static', fileName));

    const product = await Product.create({
      price,
      name,
      price_with_card: priceWithCard,
      weight,
      brandId,
      categoryId,
      img: fileName,
    });

    if (discount) {
      await Discount.create({
        discount,
        productId: product.id,
      });
    }

    return product;
  }

  async changeProduct({
    price,
    name,
    id,
    priceWithCard,
    weight,
    brandId,
    img,
    categoryId,
    discount,
  }) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    let fileName;
    if (!img) {
      fileName = product.img;
    } else {
      fileName = uuid.v4() + '.jpg';
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
      price_with_card: priceWithCard,
      weight,
      brandId,
      categoryId,
      img: fileName,
    });

    if (discount) {
      const discountValue = await Discount.findOne({ where: { productId: product.id } });
      if (!discountValue) {
        return await Discount.create({ discount, productId: product.id });
      }

      await discountValue.update({ discount });
    }

    return result;
  }

  async deleteProduct(id) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    const discount = await Discount.findOne({ where: { productId: product.id } });
    if (discount) {
      await discount.destroy();
    }

    const result = await product.destroy();
    return result;
  }

  async getProducts(page, amount) {
    const skip = (Number(page) - 1) * Number(amount);
    const products = await Product.findAll({ offset: skip, limit: Number(amount) });
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
    const skip = (Number(page) - 1) * Number(amount);
    const discounts = await Discount.findAll({ offset: skip, limit: Number(amount) });
    if (discounts.length === 0) {
      throw ApiError.badRequest('Продукты с акцией еще не добавлены');
    }

    const products = [];
    for (const discount of discounts) {
      const product = await Product.findOne({ where: { id: discount.productId } });

      const discountProductDto = new DiscountProductDto({ product, discount });
      products.push({ ...discountProductDto });
    }

    return products;
  }
  async getLatestProducts({ page, amount }) {
    const skip = (Number(page) - 1) * Number(amount);
    const products = await Product.findAll({
      offset: skip,
      limit: Number(amount),
      order: [['createdAt', 'DESC']],
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
