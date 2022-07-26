const { User } = require('../models/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const ApiError = require('../errors/ApiError');
const formattingPhoneNumber = require('../commons/formattingPhoneNumber');
const creatingActivationCode = require('../commons/creatingActivationCode');

class UserController {
  async registration(req, res, next) {
    const { phoneNumber, surname, name, password, birthday, region, city, gender } = req.body;

    if (!phoneNumber || !password) {
      return next(ApiError.badRequest('Некорректный номер телефона или пароль.'));
    }

    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);

    const candidate = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (candidate) {
      return next(
        ApiError.badRequest('Пользователь по такому номеру телефона уже зарегестрирован.'),
      );
    }
    const hashPassword = await bcrypt.hash(password, 5);
    const activationCode = creatingActivationCode();
    await User.create({
      phoneNumber: formattedPhoneNumber,
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

    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);

    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (!user) {
      return next(ApiError.badRequest('Такого пользователя не существует.'));
    }
    const newCode = creatingActivationCode();
    await user.update({ activationCode: newCode, isActivated: false });

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

    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);

    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });

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

    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);

    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
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
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return next(ApiError.badRequest('Некорректный номер'));
    }

    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);

    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
    if (!user) {
      return next(ApiError.internal('Такого пользователя не существует.'));
    }

    const newCode = creatingActivationCode();
    await user.update({ activationCode: newCode, isActivated: false });

    const code = user.activationCode;

    const result = await fetch(
      `https://${process.env.SMSAERO_EMAIL}:${process.env.SMSAERO_APIKEY}@gate.smsaero.ru/v2/sms/send?number=${user.phoneNumber}&text=${code}&sign=Severyanochka`,
    );

    if (result.data.success === true) {
      return res.json({ message: 'Код успешно отправлен.' });
    } else if (result.data.sucess === false) {
      return next(ApiError.internal('Что-то пошло не так. Повторите через несколько минут.'));
    }

    return res.status(200).json({ message: 'Код отправлен по номеру телефона.' });
  }

  async newPassword(req, res, next) {
    const { password, phoneNumber } = req.body;
    if (!password || !phoneNumber) {
      return next(ApiError.badRequest('Некорректный пароль.'));
    }

    const formattedPhoneNumber = formattingPhoneNumber(phoneNumber);

    const user = await User.findOne({ where: { phoneNumber: formattedPhoneNumber } });
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
