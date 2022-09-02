const { SavingsCard } = require('../models/models');
const ApiError = require('../errors/ApiError');
const SavingsCardDto = require('../dtos/savings-card-dto');

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
    const user = await User.findOne({ id: userId });
    if (!user) {
      throw ApiError.badRequest('Пользователя с таким ID не существует');
    }

    const savingsCard = await SavingsCard.findOne({ where: { userId } });
    if (!savingsCard) {
      throw ApiError.badRequest('У этого пользователя нет накопительной карты');
    }

    await user.update({ haveSavingsCard: true });

    const result = await savingsCard.update({
      numberOfPoints: savingsCard.numberOfPoints + amountPoints,
    });

    return result;
  }
  async getSavingsCard({ userId }) {
    const savingsCard = await SavingsCard.findOne({ where: { userId } });
    if (!savingsCard) {
      throw ApiError.badRequest('У пользователя нет накопительной карты');
    }

    const savingsCardDto = new SavingsCardDto({ savingsCard });
    return { ...savingsCardDto };
  }
}

module.exports = new SavingsCardService();
