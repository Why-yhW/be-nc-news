const db = require("../../db/connection");

exports.fetchArticles = () => {
  return db
    .query(
      `SELECT
        articles.article_id,
        articles.author,
        articles.title,
        articles.topic,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.article_id) ::INT AS comment_count
      FROM articles
      LEFT JOIN comments ON comments.article_id = articles.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE articles.article_id = $1`, [
      article_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Article not found" });
      } else {
        return rows[0];
      }
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return this.fetchArticleById(article_id)
    .then(() => {
      return db.query(
        `
    SELECT * 
    FROM comments 
    WHERE article_id = $1 
    ORDER BY created_at DESC`,
        [Number(article_id)]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};

exports.addCommentsByArticleId = (insertData, article_id) => {
  const { body, username } = insertData;
  return this.fetchArticleById(article_id).then(() => {
    return db
      .query(
        `INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *`,
        [username, body, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
