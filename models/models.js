const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  phoneNumber: { type: DataTypes.STRING, unique: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  surname: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  birthday: { type: DataTypes.STRING },
  region: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  gender: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'user' },
  activationCode: { type: DataTypes.INTEGER },
  isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
});

module.exports = {
  User,
};
