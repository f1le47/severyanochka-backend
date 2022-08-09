const jwt = require('jsonwebtoken');
require('dotenv').config();

class TokenService {
  generateTokens(payload) {
    // METHOD SIGN IS SYNCHRONOUS
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, { expiresIn: '30m' });
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, { expiresIn: '15d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  validateAccessToken(accessToken) {
    try {
      const userDto = jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN);
      return userDto;
    } catch (e) {
      return null;
    }
  }

  async validateRefreshToken(refreshToken) {
    try {
      const userDto = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
      return userDto;
    } catch (e) {
      return null;
    }
  }
}

module.exports = new TokenService();
