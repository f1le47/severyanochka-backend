module.exports = class SavingsCardDto {
  numberOfPoints;
  userId;

  constructor({ savingsCard }) {
    this.numberOfPoints = savingsCard.numberOfPoints;
    this.userId = savingsCard.userId;
  }
};
