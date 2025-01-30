const { fetchEndpoints } = require("../modules/fetch.endpoint");

exports.getApi = (req, res, next) => {
  const endpoints = fetchEndpoints();
  res.status(200).send({ endpoints });
};
