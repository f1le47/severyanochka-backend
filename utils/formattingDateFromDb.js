function formattingDateFromDb(date) {
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
}

module.exports = formattingDateFromDb;
