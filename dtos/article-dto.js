const formattingDateFromDb = require('../utils/formattingDateFromDb');

module.exports = class ArticleDto {
  id;
  title;
  article_text;
  img;
  date;

  constructor({ article }) {
    this.id = article.id;
    this.title = article.title;
    this.article_text = article.article_text;
    this.img = article.img;
    this.date = formattingDateFromDb(article.createdAt);
  }
};
