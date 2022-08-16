const ApiError = require('../errors/ApiError');
const ProductService = require('../services/product-service');
const uuid = require('uuid');
const path = require('path');

class ProductController {
  async getProduct(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(new ApiError.badRequest('Укажите ID'));
      }

      const product = await ProductService.getProduct(id);

      return res.json({ product });
    } catch (e) {
      next(e);
    }
  }
  async addProduct(req, res, next) {
    try {
      const { name, price, priceWithCard, weight, brandId, categoryId } = req.body;
      const { img } = req.files;
      let fileName = uuid.v4() + '.jpg';
      if (img) {
        await img.mv(path.resolve(__dirname, '..', 'static', fileName));
      }

      if (!price || !name || !priceWithCard || !weight || !brandId || !categoryId) {
        return next(ApiError.badRequest('Не указаны данные продукта'));
      }

      await ProductService.addProduct({
        price,
        name,
        priceWithCard,
        weight,
        brandId,
        fileName,
        categoryId,
      });

      return res.json({ message: 'Новый продукт успешно добавлен' });
    } catch (e) {
      next(e);
    }
  }
  async changeProduct(req, res, next) {
    try {
      const { price, name, id, priceWithCard, weight, brandId, categoryId } = req.body;
      if (!price || !name || !id || !priceWithCard || !weight || !brandId || !categoryId) {
        return next(ApiError.badRequest('Не указаны данные продукта'));
      }
      const { img } = req.files;
      let fileName;
      if (img) {
        fileName = uuid.v4() + '.jpg';
        await img.mv(__dirname + '..', 'static', fileName);
      }

      await ProductService.changeProduct({
        price,
        name,
        id,
        priceWithCard,
        weight,
        brandId,
        categoryId,
        fileName,
      });

      return res.json({ message: 'Продукт успешно изменен' });
    } catch (e) {
      next(e);
    }
  }
  async deleteProduct(req, res, next) {
    try {
      const { id } = req.query;
      if (!id) {
        return next(ApiError.badRequest('Не указан ID'));
      }

      await ProductService.deleteProduct(id);

      return res.json({ message: 'Продукт успешно удален' });
    } catch (e) {
      next(e);
    }
  }
  async getProducts(req, res, next) {
    try {
      let { page, amount } = req.query;
      if (!page) {
        page = 1;
      }
      if (!amount) {
        amount = 4;
      }

      const products = await ProductService.getProducts(page, amount);

      return res.json({ products });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();
