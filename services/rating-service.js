const ApiError = require('../errors/ApiError');
const { Product, User, Rating } = require('../models/models');
const sequelize = require('../db');
const recalculationRating = require('../utils/recalculationRating');
const RatingDto = require('../dtos/rating-dto');

class RatingService {
  async addRate({ userId, rate, comment, productId }) {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw ApiError.badRequest('Пользователя с таким ID не существует');
    }

    const isSet = await Rating.findOne({
      where: { userId, productId },
    });
    if (isSet) {
      throw ApiError.badRequest('Вы уже ставили оценку этому продукту');
    }

    const rating = await Rating.create({
      rate,
      comment,
      userId,
      productId,
    });

    await recalculationRating(productId);

    return rating;
  }

  async changeRate({ userId, productId, rate, comment }) {
    const product = await Product.findOne({ where: { id: productId } });
    if (!product) {
      throw ApiError.badRequest('Продукта с таким ID не существует');
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw ApiError.badRequest('Пользователя с таким ID не существует');
    }
    const rating = await Rating.findOne({ where: { userId, productId } });
    if (!rating) {
      throw ApiError.badRequest('Такой оценки не существует');
    }
    const result = await rating.update({ rate, comment });

    await recalculationRating(productId);

    return result;
  }

  async deleteRate({ userId, productId }) {
    const rating = await Rating.findOne({ where: { userId, productId } });
    if (!rating) {
      throw ApiError.badRequest('Такой оценки не существует');
    }

    const result = await rating.destroy();

    await recalculationRating(productId);

    return result;
  }

  async getRatings({ productId }) {
    const ratings = await Rating.findAll({ where: { productId }, include: [{ model: User }] });

    const amountRatings = await Rating.count({ where: { productId } });

    const fullRatings = [];
    ratings.forEach((rating) => {
      const ratingDto = new RatingDto({ rating });
      fullRatings.push({ ...ratingDto });
    });

    return {fullRatings, amountRatings};
  }
}

module.exports = new RatingService();
