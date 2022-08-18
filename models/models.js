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
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const BasketProduct = sequelize.define('basket_product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Product = sequelize.define('product', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  price: { type: DataTypes.STRING, allowNull: false },
  price_with_card: { type: DataTypes.STRING, allowNull: false },
  img: { type: DataTypes.STRING },
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
});

const BrandCategory = sequelize.define('brand_category', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
  comment: { type: DataTypes.STRING },
});

const Discount = sequelize.define('discount', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  discount: { type: DataTypes.INTEGER, allowNull: false },
});

User.hasOne(Basket);
Basket.belongsTo(User);

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
};
