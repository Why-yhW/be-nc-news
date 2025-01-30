const express = require("express");
const { getApi } = require("./controllers/get.api");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticleById,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/articles.controllers");

const app = express();
const port = 9090;

app.use(express.json());

//Endpoints start here

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

//Endpoints end here
//Error handling starts here

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found!" });
});

app.use((err, req, res, next) => {
  if (err.message === "Article not found") {
    res.status(404).send({ error: "Not Found" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ error: "Bad Request" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23502") {
    res.status(400).send({ error: "Missing required key in given body" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.code === "23503") {
    res.status(404).send({ error: "User does not exsist" });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  console.log(err);
});

//Error handling ends here
module.exports = { port, app };
