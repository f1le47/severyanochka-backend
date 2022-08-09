module.exports = class UserDto {
  id;
  phoneNumber;
  role;

  constructor(model) {
    this.id = model.id;
    this.phoneNumber = model.phoneNumber;
    this.role = model.role;
  }
};
