const ApiError = require('../errors/ApiError');
const ratingService = require('../services/rating-service');

class RatingController {
  async addRate(req, res, next) {
    try {
      const { userId, rate, comment, productId } = req.body;
      if (!userId || !rate || !productId) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await ratingService.addRate({ userId, rate, productId, comment });

      return res.json({ message: 'Оценка успешно добавлена' });
    } catch (e) {
      next(e);
    }
  }

  async changeRate(req, res, next) {
    try {
      const { userId, productId, rate, comment } = req.body;
      if (!userId || !productId || !rate) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      await ratingService.changeRate({ userId, productId, rate, comment });

      return res.json({ message: 'Оценка успешно изменена' });
    } catch (e) {
      next(e);
    }
  }

  async deleteRate(req, res, next) {
    const { userId, productId } = req.query;
    if (!userId || !productId) {
      return next(ApiError.badRequest('Не указаны данные'));
    }

    await ratingService.deleteRate({ userId, productId });

    return res.json({ message: 'Оценка успешно удалена' });
  }

  async getRatings(req, res, next) {
    try {
      const { productId } = req.query;

      const ratings = await ratingService.getRatings({ productId });

      return res.json({ ratings: ratings.fullRatings, amountRatings: ratings.amountRatings });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new RatingController();
