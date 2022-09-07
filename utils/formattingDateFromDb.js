function formattingDateFromDb(date) {
  let day = date.getDate();
  let month = date.getMonth();
  const year = date.getFullYear();

  if (String(day).length === 1) {
    day = `0${day}`;
  }
  if (String(month).length === 1) {
    month = `0${month}`;
  }

  return `${day}.${month}.${year}`;
}

module.exports = formattingDateFromDb;
