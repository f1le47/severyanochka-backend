const ApiError = require('../errors/ApiError');
const { Product, Brand, Rating, Category } = require('../models/models');
const ProductDto = require('../dtos/product-dto');

class ProductService {
  async getProduct(id) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }
    const brand = await Brand.findOne({ where: { id: product.brandId } });
    const category = await Category.findOne({ where: { id: product.categoryId } });

    const productDto = new ProductDto({
      id: product.id,
      name: product.name,
      price: product.price,
      price_with_card: product.price_with_card,
      weight: product.weight,
      brand: brand.name,
      category: category.name,
      rating: product.rating,
      img: product.img,
    });

    return { ...productDto };
  }

  async addProduct({ price, name, priceWithCard, weight, brandId, fileName, categoryId }) {
    const candidate = await Product.findOne({ where: { name } });
    if (candidate) {
      throw ApiError.badRequest('Продукт с таким названием уже существует');
    }

    const product = await Product.create({
      price,
      name,
      price_with_card: priceWithCard,
      weight,
      brandId,
      categoryId,
      img: fileName,
    });

    return product;
  }

  async changeProduct({ price, name, id, priceWithCard, weight, brandId, fileName, categoryId }) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    let newFileName;
    if (!fileName) {
      newFileName = product.img;
    } else if (fileName) {
      newFileName = fileName;
    }

    console.log(categoryId);

    const result = await product.update({
      name,
      price,
      price_with_card: priceWithCard,
      weight,
      brandId,
      categoryId,
      img: newFileName,
    });

    return result;
  }

  async deleteProduct(id) {
    const product = await Product.findOne({ where: { id } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }

    const result = await product.destroy();
    return result;
  }

  async getProducts(page, amount) {
    const skip = (Number(page) - 1) * Number(amount);
    const products = await Product.findAll({ offset: skip, limit: Number(amount) });
    if (!products) {
      throw ApiError.badRequest('Продукты еще не добавлены');
    }

    const fullProducts = [];
    for (const product of products) {
      const brand = await Brand.findOne({ where: { id: product.brandId } });
      const category = await Category.findOne({ where: { id: product.categoryId } });

      const productDto = new ProductDto({
        id: product.id,
        name: product.name,
        price: product.price,
        price_with_card: product.price_with_card,
        weight: product.weight,
        brand: brand.name,
        img: product.img,
        category: category.name,
        rating: product.rating,
      });
      fullProducts.push({ ...productDto });
    }

    return fullProducts;
  }
}

module.exports = new ProductService();
