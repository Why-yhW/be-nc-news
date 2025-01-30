const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const { app } = require("../app/app");
const request = require("supertest");
const db = require("be-nc-news/db/connection.js");
const seed = require("be-nc-news/db/seeds/seed.js");
const data = require("be-nc-news/db/data/test-data/index.js");
/* Set up your beforeEach & afterAll functions here */

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("404: Responds with a error message saying that the endpoint coudn't be found", () => {
    return request(app)
      .get("/api/fake")
      .expect(404)
      .then(({ body: { error } }) => {
        expect(error).toEqual("Endpoint not found!");
      });
  });
  describe("GET /api/topics", () => {
    test("200: Responds with an object called topic which cantains an array of objects.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics.length).toEqual(3);
          topics.forEach((topic) => {
            expect(typeof topic.slug).toEqual("string");
            expect(typeof topic.description).toEqual("string");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("404: Responds with an error if the article_id does not exist", () => {
      return request(app)
        .get("/api/articles/20")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Not Found" });
        });
    });
    test("400: Responds with an error if the article_id is not a number", () => {
      return request(app)
        .get("/api/articles/tomato")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Bad Request" });
        });
    });
    test("200: Responds with the appropriate article object", () => {
      return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({ body: { article } }) => {
          expect(typeof article.author).toEqual("string");
          expect(typeof article.title).toEqual("string");
          expect(article.article_id).toEqual(2);
          expect(typeof article.body).toEqual("string");
          expect(typeof article.topic).toEqual("string");
          expect(typeof article.created_at).toEqual("string");
          expect(typeof article.votes).toEqual("number");
          expect(typeof article.article_img_url).toEqual("string");
        });
    });
  });
  describe("GET /api/articles", () => {
    test("200: Responds with an array of article objects", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles.length).toEqual(13);
          expect(articles).toBeSortedBy("created_at", {
            descending: true,
          });
          articles.forEach((article) => {
            expect(Object.keys(article).includes("body")).toEqual(false);
            expect(typeof article.author).toEqual("string");
            expect(typeof article.title).toEqual("string");
            expect(typeof article.article_id).toEqual("number");
            expect(typeof article.topic).toEqual("string");
            expect(typeof article.created_at).toEqual("string");
            expect(typeof article.votes).toEqual("number");
            expect(typeof article.article_img_url).toEqual("string");
            expect(typeof article.comment_count).toEqual("number");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: Responds with an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toEqual(11);
          expect(comments).toBeSortedBy("created_at", { descending: true });
          comments.forEach((comment) => {
            expect(typeof comment.comment_id).toEqual("number");
            expect(typeof comment.votes).toEqual("number");
            expect(typeof comment.created_at).toEqual("string");
            expect(typeof comment.author).toEqual("string");
            expect(typeof comment.body).toEqual("string");
            expect(comment.article_id).toEqual(1);
          });
        });
    });
    test("200: Responds with an empty array if there are no comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).toEqual(0);
        });
    });
    test("404: Responds with an error if the article_id does not exist", () => {
      return request(app)
        .get("/api/articles/50/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Not Found" });
        });
    });
    test("400: Responds with an error if the article_id is not a number", () => {
      return request(app)
        .get("/api/articles/tomato/comments")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Bad Request" });
        });
    });
  });
  describe("POST /api/articles/:article_id/comments", () => {
    test("201: Responds with the posted comment", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "lurker",
          body: "Have not read, just thought I would post somthing.",
        })
        .expect(201)
        .then(({ body: { comment } }) => {
          expect(typeof comment.comment_id).toEqual("number");
          expect(comment.body).toEqual(
            "Have not read, just thought I would post somthing."
          );
          expect(comment.article_id).toEqual(1);
          expect(comment.author).toEqual("lurker");
          expect(typeof comment.votes).toEqual("number");
          expect(typeof comment.created_at).toEqual("string");
        });
    });
    test("404: Responds whith error when using an unknown username", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          username: "WhyyhW",
          body: "Have not read, just thought I would post somthing.",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "User does not exsist" });
        });
    });
    test("400: Responds whith error when a key in the given body is wrong or missing", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({
          usarname: "lurker",
          body: "Have not read, just thought I would post somthing.",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Missing required key in given body" });
        });
    });
    test("404: Responds with an error if the article_id does not exist", () => {
      return request(app)
        .post("/api/articles/400/comments")
        .send({
          username: "WhyyhW",
          body: "Have not read, just thought I would post somthing.",
        })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Not Found" });
        });
    });
    test("400: Responds with an error if the article_id is not a number", () => {
      return request(app)
        .post("/api/articles/potato/comments")
        .send({
          usarname: "lurker",
          body: "Have not read, just thought I would post somthing.",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Bad Request" });
        });
    });
  });
  describe("PATCH /api/articles/:article_id", () => {
    test("201: Responds with the updated article having a positive vote", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 10 })
        .expect(201)
        .then(({ body: { article } }) => {
          expect(typeof article.author).toEqual("string");
          expect(typeof article.title).toEqual("string");
          expect(article.article_id).toEqual(1);
          expect(typeof article.topic).toEqual("string");
          expect(typeof article.created_at).toEqual("string");
          expect(article.votes).toEqual(110);
          expect(typeof article.article_img_url).toEqual("string");
          expect(typeof article.body).toEqual("string");
        });
    });
    test("201: Responds with the updated article having a negative vote", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -110 })
        .expect(201)
        .then(({ body: { article } }) => {
          expect(article.article_id).toEqual(1);
          expect(article.votes).toEqual(-10);
        });
    });
    test("400: Responds with an error message when character are given istead of numbers", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "apple" })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Bad Request" });
        });
    });
    test("400: Responds whith error when a key in the given body is wrong or missing", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_vtes: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Missing required key in given body" });
        });
    });
    test("404: Responds with an error if the article_id does not exist", () => {
      return request(app)
        .patch("/api/articles/100")
        .send({ inc_vtes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Not Found" });
        });
    });
    test("400: Responds with an error if the article_id is not a number", () => {
      return request(app)
        .patch("/api/articles/tomato")
        .send({ inc_vtes: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Bad Request" });
        });
    });
  });
  describe("DELETE /api/comments/:comment_id", () => {
    test("204: Responds with no content and the comment with the matching id should be deleted", () => {
      return request(app)
        .delete("/api/comments/1")
        .expect(204)
        .then(() => {
          return request(app).delete("/api/comments/1");
        })
        .then((reslut) => {
          expect(reslut.status).toEqual(404);
          expect(reslut.body).toEqual({ error: "Not Found" });
        });
    });
    test("404: Responds with an error if the comment_id does not exist", () => {
      return request(app)
        .delete("/api/comments/1000")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Not Found" });
        });
    });
    test("400: Responds with an error if the comment_id is not a number", () => {
      return request(app)
        .delete("/api/comments/tomato")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Bad Request" });
        });
    });
  });
  describe("GET /api/users", () => {
    test("200: Responds with an array of all the users objects", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users.length).toEqual(4);
          users.forEach((user) => {
            expect(typeof user.username).toEqual("string");
            expect(typeof user.name).toEqual("string");
            expect(typeof user.avatar_url).toEqual("string");
          });
        });
    });
    test("404: responds with an error message when the url is entered wrong", () => {
      return request(app)
        .get("/api/user")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Endpoint not found!" });
        });
    });
  });
  describe("GET /api/articles (sorting queries)", () => {
    test("200: Responds with an array of article objects sorted by queries", () => {
      return request(app)
        .get("/api/articles?sorted_by=title")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title", {
            descending: true,
          });
        });
    });
    test("400: Responds with an error if the query is using an invaled sort_by", () => {
      return request(app)
        .get("/api/articles?sorted_by=titlle")
        .expect(400)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Bad query" });
        });
    });
  });
});
