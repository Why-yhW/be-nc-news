const db = require("../../db/connection");

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
