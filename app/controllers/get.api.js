const {
  fetchEndpoints,
  fetchTopics,
  fetchArticleById,
  fetchArticles,
} = require("../modules/fetch.endpoint");

exports.getApi = (req, res, next) => {
  const endpoints = fetchEndpoints();
  res.status(200).send({ endpoints });
};

exports.getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  fetchArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};
