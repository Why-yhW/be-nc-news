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
            expect(typeof article.comment_count).toEqual("string");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id/comments", () => {
    test("200: responds with an array of comments for the given article_id", () => {
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
    test("200: responds with an array of comments for the given article_id", () => {
      return request(app)
        .get("/api/articles/50/comments")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Not Found" });
        });
    });
  });
});
