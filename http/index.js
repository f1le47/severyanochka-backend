const EMAIL = process.env.SMSAERO_EMAIL;
const API_KEY = process.env.SMSAERO_APIKEY;

class HttpRequests {
  async sendMessage(phoneNumber, code) {
    return await axios.get(
      `https://${EMAIL}:${API_KEY}}@gate.smsaero.ru/v2/sms/send?number=${phoneNumber}&text=Код подтверждения: ${code}&sign=SMS Aero`,
    );
  }
}

exports.default = new HttpRequests();
