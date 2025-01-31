const {
  removeCommentByCommentId,
  fetchCommentsByArticleId,
  addCommentsByArticleId,
} = require("../modules/comments.module");

exports.deleteCommentByCommentId = (req, res, next) => {
  removeCommentByCommentId(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params.article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByArticleId = (req, res, next) => {
  addCommentsByArticleId(req.body, req.params.article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
