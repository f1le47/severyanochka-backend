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
    await User.create({
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

  async sendCode(req, res, next) {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return next(ApiError.badRequest('Введите номер телефона.'));
    }

    let formattedNumber;
    if (phoneNumber[0] === '+') {
      formattedNumber = phoneNumber.slice(1);
    } else if (phoneNumber[0] === '8') {
      formattedNumber = '7' + phoneNumber.slice(1);
    }

    const user = await User.findOne({ where: { phoneNumber: formattedNumber } });
    if (!user) {
      return next(ApiError.badRequest('Такого пользователя не существует.'));
    }

    const code = user.activationCode;

    const result = await fetch(
      `https://${process.env.SMSAERO_EMAIL}:${process.env.SMSAERO_APIKEY}@gate.smsaero.ru/v2/sms/send?number=${user.phoneNumber}&text=${code}&sign=Severyanochka`,
    );

    if (result.data.success === true) {
      return res.json({ message: 'Код успешно отправлен.' });
    } else if (result.data.sucess === false) {
      return next(ApiError.internal('Что-то пошло не так. Повторите через несколько минут.'));
    }
  }

  async confirmCode(req, res, next) {
    const { code, phoneNumber } = req.body;

    if (!code || !phoneNumber) {
      return next(ApiError.badRequest('Введите код.'));
    }

    const user = await User.findOne({ where: { phoneNumber } });

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
      return next(ApiError.badRequest('Некорректный номер или пароль'));
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return next(ApiError.internal('Такого пользователя не существует.'));
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
      return next(ApiError.badRequest('Некорректный номер'));
    }

    const user = await User.findOne({ where: { phoneNumber } });
    if (!user) {
      return next(ApiError.internal('Такого пользователя не существует.'));
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

    return res.status(200).json({ message: 'Пароль успешно изменен.' });
  }

  async check(req, res, next) {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return next(ApiError.badRequest('Не авторизован'));
    }

    let token = authorization.split(' ')[1];

    if (token == 'null') {
      token = null;
    }

    if (!token) {
      return next(ApiError.badRequest('Не авторизован.'));
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    const user = await User.findOne({ where: { phoneNumber: decoded.phoneNumber } });

    if (!user) {
      return next(ApiError.badRequest('Такого пользователя не существует.'));
    }

    return res.json({
      user: {
        phoneNumber: user.phoneNumber,
        name: user.name,
        surname: user.surname,
        birthday: user.birthday,
        region: user.region,
        city: user.city,
        gender: user.gender,
        role: user.role,
        isActivated: user.isActivated,
      },
    });
  }
}

module.exports = new UserController();
