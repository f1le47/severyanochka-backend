const { Rating, Product } = require('../models/models');

async function recalculationRating(productId) {
  const ratings = await Rating.findAll({ where: { productId } });
  if (ratings.length === 0) {
    return null;
  }
  let rates = 0;
  let ratesCount = 0;
  ratings.forEach((rating) => {
    rates = rates + rating.rate;
    ratesCount = ratesCount + 1;
  });
  const avgRating = Math.round(rates / ratesCount);

  const product = await Product.findOne({ where: { id: productId } });
  await product.update({ rating: avgRating });
}

module.exports = recalculationRating;
