const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
  birthday: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' },
  activationCode: { type: DataTypes.INTEGER },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
  haveSavingsCard: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const SavingsCard = sequelize.define('savings_card', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  numberOfPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define('basket_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  amount: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  img: { type: DataTypes.STRING },
  isDiscount: { type: DataTypes.BOOLEAN, defaultValue: false },
  weight: { type: DataTypes.STRING, allowNull: false },
  rating: { type: DataTypes.INTEGER, defaultValue: 0 },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
});

const Category = sequelize.define('category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  img: { type: DataTypes.STRING },
});

const BrandCategory = sequelize.define('brand_category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING },
});

const Favorite = sequelize.define('favorite', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const FavoriteProduct = sequelize.define('favorite_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Discount = sequelize.define('discount', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  discount: { type: DataTypes.INTEGER, allowNull: false },
  priceWithCard: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
});

const Article = sequelize.define('article', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, unique: true },
  article_text: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING, allowNull: false },
});

const Job = sequelize.define('job', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  job_title: { type: DataTypes.STRING, allowNull: false, unique: true },
  requirements: { type: DataTypes.STRING, allowNull: false },
  responsibilities: { type: DataTypes.STRING, allowNull: false },
  terms: { type: DataTypes.STRING, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasOne(SavingsCard);
SavingsCard.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

Basket.hasMany(BasketProduct);
BasketProduct.belongsTo(Basket);

Product.hasMany(BasketProduct);
BasketProduct.belongsTo(Product);

Product.hasMany(Rating);
Rating.belongsTo(Product);

Brand.hasMany(Product);
Product.belongsTo(Brand);

Category.hasMany(Product);
Product.belongsTo(Category);

Brand.belongsToMany(Category, { through: BrandCategory });
Category.belongsToMany(Brand, { through: BrandCategory });

Product.hasOne(Discount);
Discount.belongsTo(Product);

User.hasOne(Favorite);
Favorite.belongsTo(User);

Favorite.hasMany(FavoriteProduct);
FavoriteProduct.belongsTo(Favorite);

Product.hasOne(FavoriteProduct);
FavoriteProduct.belongsTo(Product);

module.exports = {
  User,
  Basket,
  BasketProduct,
  Product,
  Brand,
  Category,
  BrandCategory,
  Rating,
  Discount,
  Article,
  Favorite,
  FavoriteProduct,
  SavingsCard,
  Job,
};
