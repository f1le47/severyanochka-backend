const savingsCardService = require('../services/savings-card-service');

class SavingsCardController {
  async createSavingsCard(req, res, next) {
    try {
      const { id } = req.user;

      const savingsCard = await savingsCardService.createSavingsCard({ userId: id });

      return res.json({ message: 'Накопительная карта успешно создана', savingsCard });
    } catch (e) {
      next(e);
    }
  }
  async getSavingsCard(req, res, next) {
    try {
      const { id } = req.user;

      const savingsCard = await savingsCardService.getSavingsCard({ userId: id });

      return res.json({ savingsCard });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new SavingsCardController();
