const formattingPhoneNumber = require('../utils/formattingPhoneNumber');
const UserDto = require('../dtos/user-dto');
const { User } = require('../models/models');
const ApiError = require('../errors/ApiError');
const TokenService = require('./token-service');
const HttpRequests = require('../http/index');
const bcrypt = require('bcrypt');
const creatingActivationCode = require('../utils/creatingActivationCode');
const favoriteService = require('./favoriteService');
const basketService = require('./basket-service');

class UserService {
  async registration(phoneNumber, surname, name, password, birthday, region, city, gender) {
    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);
    const candidate = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (candidate) {
      throw ApiError.badRequest('Пользователь по такому номеру телефона уже зарегестрирован');
    }

    const hashPassword = await bcrypt.hash(password, 5);
    const activationCode = creatingActivationCode();

    const user = await User.create({
      phoneNumber: formattedPhoneNumber,
      name,
      surname,
      password: hashPassword,
      birthday,
      region,
      city,
      gender,
      activationCode,
    });

    await favoriteService.createFavorite({ userId: user.id });
    await basketService.createBasket({ userId: user.id });

    // Sending SMS on mobile phone
    try {
      await HttpRequests.sendMessage(formattedPhoneNumber, activationCode);
    } catch (e) {
      console.error(e);
      throw ApiError.internal('Не удалось отправить код, попробуйте позже');
    }
  }

  async resendCode(phoneNumber) {
    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);
    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (!user) {
      throw ApiError.badRequest('Такого пользователя не существует');
    }

    const newCode = creatingActivationCode();
    await user.update({ activationCode: newCode, isActivated: false });

    const code = user.activationCode;

    try {
      await HttpRequests.sendMessage(formattedPhoneNumber, code);
    } catch (e) {
      throw ApiError.internal();
    }
  }

  async confirmCode(phoneNumber, code) {
    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);

    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (!user) {
      throw ApiError.badRequest('Такого пользователя не существует');
    }

    if (user.isActivated === true) {
      throw ApiError.badRequest('Код уже подтвержден');
    }
    if (user.activationCode !== Number(code)) {
      throw ApiError.badRequest('Неверный код');
    }

    await user.update({ isActivated: true });
  }

  async login(phoneNumber, password) {
    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);
    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (!user) {
      throw ApiError.badRequest('Такого пользователя не существует');
    }

    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      throw ApiError.badRequest('Указан неверный пароль');
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({ ...userDto });

    return tokens;
  }

  async restorePassword(phoneNumber) {
    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);
    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (!user) {
      throw ApiError.badRequest('Такого пользователя не существует');
    }

    const newCode = creatingActivationCode();
    await user.update({ activationCode: newCode, isActivated: false });

    const code = user.activationCode;

    try {
      await HttpRequests.sendMessage(formattedPhoneNumber, code);
    } catch (e) {
      console.log(e);
      throw ApiError.internal();
    }
  }

  async newPassword(phoneNumber, password) {
    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);
    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (!user) {
      throw ApiError.badRequest('Такого пользователя не существует');
    }

    try {
      const hashPassword = await bcrypt.hash(password, 5);
      await user.update({ password: hashPassword });
    } catch (e) {
      console.error(e);
      throw ApiError.internal();
    }
  }

  async checkAuth(accessToken) {
    const decoded = TokenService.validateAccessToken(accessToken);
    if (!decoded) {
      throw ApiError.unauthorized('Access token не валиден');
    }

    const user = await User.findOne({ where: { phoneNumber: decoded.phoneNumber } });
    if (!user) {
      return next(ApiError.badRequest('Пользователя с таким телефоном не существует'));
    }

    return user;
  }

  async refresh(refreshToken) {
    const decoded = await TokenService.validateRefreshToken(refreshToken);
    if (!decoded) {
      throw ApiError.forbidden('Refresh token не валиден');
    }

    const userDto = new UserDto(decoded);
    const tokens = TokenService.generateTokens({ ...userDto });

    return tokens;
  }
}

module.exports = new UserService();
