const db = require("../../db/connection");
const { fetchArticleById } = require("./articles.modules");

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "Comment not found" });
      } else {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [
          comment_id,
        ]);
      }
    });
};

exports.fetchCommentsByArticleId = (article_id) => {
  return fetchArticleById(article_id)
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
  return fetchArticleById(article_id).then(() => {
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
