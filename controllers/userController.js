const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');

class UserController {
  async registration(req, res, next) {
    const { phoneNumber, surname, name, password, birthday, region, city, gender } = req.body;

    console.log(req.body);

    // function for creating activation code
    function randomInteger(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    }

    if (!phoneNumber || !password) {
      return next(ApiError.badRequest('Некорректный номер телефона или пароль.'));
    }
    const candidate = await User.findOne({ where: { phoneNumber } });
    if (candidate) {
      return next(
        ApiError.badRequest('Пользователь по такому номеру телефона уже зарегестрирован.'),
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const activationCode = randomInteger(1000, 9999);
    const user = await User.create({
      phoneNumber,
      name,
      password: hashPassword,
      surname,
      birthday,
      region,
      city,
      gender,
      activationCode,
    });

    return res.status(200).json({ message: 'Код отправлен по номеру телефона.' });
  }

  async confirmCode(req, res, next) {
    const { code, phoneNumber } = req.body;

    if (!code || !phoneNumber) {
      return next(ApiError.badRequest('Введите код.'));
    }

    const user = await User.findOne({ where: { phoneNumber: phoneNumber } });

    if (!user) {
      return next(ApiError.badRequest('Такого пользователя не существует.'));
    }

    if (user.isActivated === true) {
      return next(ApiError.badRequest('Код уже подтвержден'));
    }

    if (user.activationCode !== code) {
      return next(ApiError.badRequest('Не верный код.'));
    }

    // Update account verification status
    user.update({ isActivated: true });

    const token = jwt.sign(
      { id: user.id, phoneNumber: user.phoneNumber, name: user.name },
      process.env.SECRET_KEY,
      {
        expiresIn: '24h',
      },
    );

    return res.json({ token });
  }

  async login(req, res, next) {
    const { phoneNumber, password } = req.body;

    if (!phoneNumber || !password) {
      return next(new ApiError.badRequest('Некорректный номер или пароль'));
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return next(new ApiError.internal('Такого пользователя не существует.'));
    }

    const comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal('Указан неверный пароль.'));
    }

    const token = jwt.sign(
      { id: user.id, phoneNumber: user.phoneNumber, name: user.name },
      process.env.SECRET_KEY,
      {
        expiresIn: '24h',
      },
    );
    return res.json({ token });
  }

  async restorePassword(req, res, next) {
    // function for creating activation code
    function randomInteger(min, max) {
      let rand = min - 0.5 + Math.random() * (max - min + 1);
      return Math.round(rand);
    }

    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return next(new ApiError.badRequest('Некорректный номер'));
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return next(new ApiError.internal('Такого пользователя не существует.'));
    }

    const code = randomInteger(1000, 9999);
    await user.update({ activationCode: code, isActivated: false });

    return res.status(200).json({ message: 'Код отправлен по номеру телефона.' });
  }

  async newPassword(req, res, next) {
    const { password, phoneNumber } = req.body;
    if (!password || !phoneNumber) {
      return next(ApiError.badRequest('Некорректный пароль.'));
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return next(ApiError.badRequest('Такого пользователя не существует.'));
    }

    const hashPassword = await bcrypt.hash(password, 5);
    await user.update({ password: hashPassword });

    return res.status(200).json({message: 'Пароль успешно изменен.'})
  }

  async check(req, res, next) {}
}

module.exports = new UserController();
