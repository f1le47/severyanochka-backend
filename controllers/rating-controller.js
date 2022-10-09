const ApiError = require('../errors/ApiError');
const ratingService = require('../services/rating-service');

class RatingController {
  async addRate(req, res, next) {
    try {
      const { id } = req.user;
      const { rate, comment, productId } = req.body;
      if (!rate || !productId) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      const rating = await ratingService.addRate({ userId: id, rate, productId, comment });

      return res.json({ message: 'Оценка успешно добавлена', rating });
    } catch (e) {
      next(e);
    }
  }

  async changeRate(req, res, next) {
    try {
      const { id } = req.user;
      const { productId, rate, comment } = req.body;
      if (!productId || !rate) {
        return next(ApiError.badRequest('Не указаны данные'));
      }

      const rating = await ratingService.changeRate({ userId: id, productId, rate, comment });

      return res.json({ message: 'Оценка успешно изменена', rating });
    } catch (e) {
      next(e);
    }
  }

  async deleteRate(req, res, next) {
    const { id } = req.user;
    const { productId } = req.query;
    if (!productId) {
      return next(ApiError.badRequest('Не указаны данные'));
    }

    await ratingService.deleteRate({ userId: id, productId });

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
