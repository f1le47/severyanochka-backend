function creatingActivationCode() {
  let code = 1000 - 0.5 + Math.random() * (9999 - 1000 + 1);
  return Math.round(code);
}

module.exports = creatingActivationCode;
