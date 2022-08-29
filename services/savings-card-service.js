const { SavingsCard } = require('../models/models');
const ApiError = require('../errors/ApiError');

class SavingsCardService {
  async createSavingsCard({ userId }) {
    const candidate = await SavingsCard.findOne({ userId });
    if (candidate) {
      throw ApiError.badRequest('У этого пользователя уже есть накопительная карта');
    }

    const savingsCard = await SavingsCard.create({ userId });

    return savingsCard;
  }
  async addPoints({ userId, amountPoints }) {
    const savingsCard = await SavingsCard.findOne({ where: { userId } });
    if (!savingsCard) {
      throw ApiError.badRequest('У этого пользователя нет накопительной карты');
    }

    const result = await savingsCard.update({
      numberOfPoints: savingsCard.numberOfPoints + amountPoints,
    });

    return result;
  }
}

module.exports = new SavingsCardService();
