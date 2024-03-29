const ApiError = require('../errors/ApiError');
const UserService = require('../services/user-service');
const FullUserDto = require('../dtos/full-user-dto');

class UserController {
  async registration(req, res, next) {
    try {
      const { phoneNumber, surname, name, password, birthday, region, city, gender } = req.body;

      if (!phoneNumber || !password) {
        return next(ApiError.badRequest('Некорректный номер телефона или пароль'));
      }

      await UserService.registration(
        phoneNumber,
        surname,
        name,
        password,
        birthday,
        region,
        city,
        gender,
      );

      return res.json({ message: 'Код отправлен по номеру телефона' });
    } catch (e) {
      next(e);
    }
  }

  async confirmCode(req, res, next) {
    try {
      const { phoneNumber, code } = req.body;

      if (!code || !phoneNumber) {
        return next(ApiError.badRequest('Введите код'));
      }

      await UserService.confirmCode(phoneNumber, code);

      return res.json({ message: 'Код успешно подтвержден' });
    } catch (e) {
      next(e);
    }
  }

  async resendCode(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return next(ApiError.badRequest('Введите номер телефона'));
      }

      await UserService.resendCode(phoneNumber);

      res.json({ message: 'Код был успешно отправлен' });
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { phoneNumber, password } = req.body;

      if (!phoneNumber || !password) {
        return next(ApiError.badRequest('Некорректный номер или пароль'));
      }

      const tokens = await UserService.login(phoneNumber, password);

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ accessToken: tokens.accessToken, message: 'Успешно авторизован' });
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('refreshToken');
      return res.json({ message: 'Успешно' });
    } catch (e) {
      next(e);
    }
  }

  async restorePassword(req, res, next) {
    try {
      const { phoneNumber } = req.body;
      if (!phoneNumber) {
        return next(ApiError.badRequest('Некорректный номер'));
      }

      await UserService.restorePassword(phoneNumber);

      res.json({ message: 'Код успешно отправлен' });
    } catch (e) {
      next(e);
    }
  }

  async newPassword(req, res, next) {
    try {
      const { phoneNumber, password } = req.body;
      if (!password || !phoneNumber) {
        return next(ApiError.badRequest('Некорректный пароль'));
      }

      await UserService.newPassword(phoneNumber, password);

      return res.json({ message: 'Пароль успешно изменен' });
    } catch (e) {
      next(e);
    }
  }

  async checkAuth(req, res, next) {
    try {
      const authorization = req.headers.authorization;
      if (!authorization) {
        return next(ApiError.unauthorized());
      }

      let token = authorization.split(' ')[1];
      if (token == 'null') {
        token = null;
      }
      if (!token) {
        return next(ApiError.unauthorized());
      }

      const user = await UserService.checkAuth(token);

      const userDto = new FullUserDto({ user });

      return res.json({ user: { ...userDto } });
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        return next(ApiError.forbidden('Авторизуйтесь'));
      }

      const tokens = await UserService.refresh(refreshToken);

      res.cookie('refreshToken', tokens.refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      return res.json({ accessToken: tokens.accessToken });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = new UserController();
