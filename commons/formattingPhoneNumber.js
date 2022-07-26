function formattingPhoneNumber(phoneNumber) {
  let formattedPhoneNumber;
  if (phoneNumber[0] === '+') {
    formattedPhoneNumber = phoneNumber.slice(1);
  } else if (phoneNumber[0] === '8') {
    formattedPhoneNumber = '7' + phoneNumber.slice(1);
  }

  return formattedPhoneNumber;
}

module.exports = formattingPhoneNumber;
