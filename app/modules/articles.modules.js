const db = require("../../db/connection");

exports.fetchArticles = ({ sorted_by, order, topic }) => {
  let sort_by = `ORDER BY created_at`;
  let order_by = `DESC`;
  let topicFilter = ``;

  if (topic) {
    const greenlistTopics = [
      "mitch",
      "cats",
      "paper",
      "coding",
      "football",
      "cooking",
    ];
    if (greenlistTopics.includes(topic)) {
      topicFilter = `WHERE topic = '${topic}'`;
    } else {
      return Promise.reject({ message: "Invalid query" });
    }
  }

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
      LEFT JOIN comments 
      ON comments.article_id = articles.article_id
      ${topicFilter}
      GROUP BY articles.article_id
      ${sort_by} ${order_by}`
    )
    .then(({ rows }) => {
      return rows;
    });
};

exports.fetchArticleById = (article_id) => {
  return db
    .query(
      `SELECT 
        articles.*, 
        COUNT(comments.article_id) ::INT AS comment_count
      FROM articles
      LEFT JOIN comments 
      ON comments.article_id = articles.article_id 
      WHERE articles.article_id = $1
      GROUP BY articles.article_id`,
      [article_id]
    )
    .then(({ rows }) => {
      console.log(rows);
      if (rows.length === 0) {
        return Promise.reject({ status: 404, message: "Article not found" });
      } else {
        return rows[0];
      }
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
