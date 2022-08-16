const ApiError = require('../errors/ApiError');
const { Brand } = require('../models/models');

class BrandService {
  async addBrand(name) {
    const candidate = await Brand.findOne({ where: { name } });
    if (candidate) {
      throw ApiError.badRequest('Такой бренд уже существует');
    }

    const brand = await Brand.create({ name });
    return brand;
  }
  async changeBrand({ id, name }) {
    const brand = await Brand.findOne({ where: { id } });
    if (!brand) {
      throw ApiError.badRequest('Бренда с таким ID не существует');
    }

    const result = await brand.update({ name });

    return result;
  }
  async deleteBrand({ id }) {
    const brand = await Brand.findOne({ where: { id } });
    if (!brand) {
      throw ApiError.badRequest('Бренда с таким ID не существует');
    }

    const result = await brand.destroy();

    return result;
  }
}

module.exports = new BrandService();
