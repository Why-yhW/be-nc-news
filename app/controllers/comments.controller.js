const { removeCommentByCommentId } = require("../modules/comments.module");

exports.deleteCommentByCommentId = (req, res, next) => {
  removeCommentByCommentId(req.params.comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};
