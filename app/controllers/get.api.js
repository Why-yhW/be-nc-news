const { fetchEndpoints, fetchTopics } = require("../modules/fetch.endpoint");

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
