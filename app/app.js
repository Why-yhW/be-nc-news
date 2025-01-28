const express = require("express");
const { getApi, getTopics, getArticleById } = require("./controllers/get.api");
const app = express();
const port = 9090;

//Endpoints start here

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles/:article_id", getArticleById);

//Endpoints end here
//Error handling starts here

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found!" });
});

app.use((err, req, res, next) => {
  if (err.message === "Article not found") {
    res.status(404).send({ error: "Not found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
});

//Error handling ends here
module.exports = { port, app };
