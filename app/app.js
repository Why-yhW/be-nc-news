const express = require("express");
const cors = require("cors");
const { getApi } = require("./controllers/get.api");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticles,
  getArticleById,
  patchArticleByArticleId,
} = require("./controllers/articles.controllers");
const {
  deleteCommentByCommentId,
  getCommentsByArticleId,
  postCommentByArticleId,
} = require("./controllers/comments.controller");
const { getUsers } = require("./controllers/users.controllers");

const app = express();
const port = 9090;

app.use(cors());
app.use(express.json());

//Endpoints start here

app.get("/api", getApi);

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/users", getUsers);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post("/api/articles/:article_id/comments", postCommentByArticleId);

app.patch("/api/articles/:article_id", patchArticleByArticleId);

app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

//Endpoints end here
//Error handling starts here

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found!" });
});

app.use((err, req, res, next) => {
  if (
    err.message === "Article not found" ||
    err.message === "Comment not found"
  ) {
    res.status(err.status).send({ error: err.message });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err.message === "Invalid query") {
    res.status(400).send({ error: "Bad query" });
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
