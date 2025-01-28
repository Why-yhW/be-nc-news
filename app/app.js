const express = require("express");
const { getApi, getTopics } = require("./controllers/get.api");
const app = express();
const port = 9090;

app.use(express.json());

//Endpoints start here

app.get("/api", getApi);

app.get("/api/topics", getTopics);

//Endpoints end here
//Error handling starts here

app.all("*", (req, res) => {
  res.status(404).send({ error: "Endpoint not found!" });
});

//Error handling ends here
module.exports = { port, app };
