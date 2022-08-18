const ApiError = require('../errors/ApiError');
const ProductService = require('../services/product-service');

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
      const { name, price, weight, brandId, categoryId, discount, priceWithCard } = req.body;
      const { img } = req.files;

      if (!price || !name || !weight || !brandId || !categoryId || !img) {
        return next(ApiError.badRequest('Не указаны данные продукта'));
      }

      await ProductService.addProduct({
        price,
        name,
        priceWithCard,
        weight,
        brandId,
        img,
        categoryId,
        discount,
      });

      return res.json({ message: 'Новый продукт успешно добавлен' });
    } catch (e) {
      next(e);
    }
  }
  async changeProduct(req, res, next) {
    try {
      const { name, id, price, weight, brandId, categoryId } = req.body;
      const { img } = req.files;

      if (!price || !name || !id || !weight || !brandId || !categoryId) {
        return next(ApiError.badRequest('Не указаны данные продукта'));
      }

      await ProductService.changeProduct({
        id,
        name,
        price,
        weight,
        brandId,
        categoryId,
        img,
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
  async getDiscountProducts(req, res, next) {
    try {
      let { page, amount } = req.query;
      if (!page) {
        page = 1;
      }
      if (!amount) {
        amount = 4;
      }

      const discountProducts = await ProductService.getDiscountProducts({ page, amount });

      return res.json({ discountProducts });
    } catch (e) {
      next(e);
    }
  }
  async getLatestProducts(req, res, next) {
    try {
      let { page, amount } = req.query;
      if (!page) {
        page = 1;
      }
      if (!amount) {
        amount = 4;
      }

      const latestProducts = await ProductService.getLatestProducts({ page, amount });

      return res.json({ latestProducts });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new ProductController();
