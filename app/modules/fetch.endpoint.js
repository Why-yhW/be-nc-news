const endpoints = require("../../endpoints.json");
const db = require("../../db/connection");

exports.fetchEndpoints = () => {
  return endpoints;
};

exports.fetchTopics = () => {
  return db.query(`SELECT * FROM topics`).then(({ rows }) => {
    return rows;
  });
};
