const db = require("../../db/connection");

exports.fetchArticles = ({ sorted_by, order }) => {
  let sort_by = `ORDER BY created_at`;
  let order_by = `DESC`;
  if (sorted_by) {
    const greenListSortBy = [
      "article_id",
      "author",
      "title",
      "topic",
      "created_at",
      "votes",
      "article_img_url",
      "comment_count",
    ];
    if (greenListSortBy.includes(sorted_by)) {
      sort_by = `ORDER BY ${sorted_by}`;
    } else {
      return Promise.reject({ message: "Invalid query" });
    }
  }

  if (order) {
    const greenListOrderBy = ["DESC", "ASC"];
    if (greenListOrderBy.includes(order.toUpperCase())) {
      order_by = `${order.toUpperCase()}`;
    } else {
      return Promise.reject({ message: "Invalid query" });
    }
  }

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
      ${sort_by} ${order_by}`
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

exports.updateArticleByArticleID = (article_id, patchData) => {
  const { inc_votes } = patchData;
  return this.fetchArticleById(article_id).then(() => {
    return db
      .query(
        `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING *
        `,
        [inc_votes, article_id]
      )
      .then(({ rows }) => {
        return rows[0];
      });
  });
};
