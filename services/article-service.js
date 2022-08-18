const ApiError = require('../errors/ApiError');
const { Article } = require('../models/models');
const path = require('path');
const uuid = require('uuid');
const fs = require('fs');
const ArticleDto = require('../dtos/article-dto');

class ArticleService {
  async getArticle({ id }) {
    const article = await Article.findOne({ where: { id } });
    if (!article) {
      throw ApiError.badRequest('Статьи с таким ID не существует');
    }

    const articleDto = new ArticleDto({ article });

    return { ...articleDto };
  }
  async createArticle({ title, articleText, img }) {
    const candidate = await Article.findOne({ where: { title } });
    if (candidate) {
      throw ApiError.badRequest('Статья с таким названием уще существует');
    }

    const fileName = 'articles/' + uuid.v4() + '.jpg';
    await img.mv(path.resolve(__dirname, '..', 'static', fileName));

    const article = await Article.create({ title, article_text: articleText, img: fileName });

    return article;
  }
  async changeArticle({ id, title, articleText, img }) {
    const article = await Article.findOne({ where: { id } });
    if (!article) {
      throw ApiError.badRequest('Статьи с таким ID не существует');
    }

    let fileName;
    if (!img) {
      fileName = article.img;
    } else {
      fileName = 'articles/' + uuid.v4() + '.jpg';
      await img.mv(path.resolve(__dirname, '..', 'static', fileName));
      fs.unlink(path.resolve(__dirname, '..', 'static', article.img), (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    const result = await article.update({ title, article_text: articleText, img: fileName });

    return result;
  }
  async deleteArticle({ id }) {
    const article = await Article.findOne({ where: { id } });
    if (!article) {
      throw ApiError.badRequest('Статьи с таким ID не существует');
    }

    fs.unlink(path.resolve(__dirname, '..', 'static', article.img), (err) => {
      if (err) {
        console.log(err);
      }
    });
    const result = await article.destroy();

    return result;
  }
}

module.exports = new ArticleService();
