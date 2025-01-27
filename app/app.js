const express = require("express");
const { getApi } = require("./controllers/get.api");
const app = express();
const port = 9090;

app.use(express.json());

app.get("/api", getApi);

module.exports = { port, app };
