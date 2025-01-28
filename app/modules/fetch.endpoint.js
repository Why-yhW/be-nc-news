const endpoints = require("../../endpoints.json");
const db = require("../../db/connection");

exports.fetchEndpoints = () => {
  return endpoints;
};

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};

exports.fetchArticleById = (params) => {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1`, [
      params.article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Article not found" });
      } else {
        return rows;
      }
    });
};
