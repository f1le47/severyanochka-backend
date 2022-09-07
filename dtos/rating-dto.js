const formattingDateFromDb = require('../utils/formattingDateFromDb')

module.exports = class RatingDto {
  id;
  rate;
  comment;
  date;
  userName;
  userId;
  productId;

  constructor({ rating }) {
    this.id = rating.id;
    this.rate = rating.rate;
    this.comment = rating.comment;
    this.date = formattingDateFromDb(rating.createdAt)
    this.userName = rating.user.name;
    this.userId = rating.user.id;
    this.productId = rating.productId;
  }
};
