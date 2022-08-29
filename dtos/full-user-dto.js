module.exports = class FullUserDto {
  id;
  phoneNumber;
  name;
  surname;
  birthday;
  region;
  city;
  gender;
  role;
  isActivated;
  haveSavingsCard;

  constructor({ user }) {
    this.id = user.id;
    this.phoneNumber = user.phoneNumber;
    this.name = user.name;
    this.surname = user.surname;
    this.birthday = user.birthday;
    this.region = user.region;
    this.city = user.city;
    this.gender = user.gender;
    this.role = user.role;
    this.isActivated = user.isActivated;
    this.haveSavingsCard = user.haveSavingsCard;
  }
};
