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
          expect(Array.isArray(topics)).toEqual(true);
          expect(topics.length).toEqual(3);
          topics.forEach((topic) => {
            let keys = Object.keys(topic);
            expect(keys.includes("slug")).toEqual(true);
            expect(keys.includes("description")).toEqual(true);
            expect(typeof topic.slug).toEqual("string");
            expect(typeof topic.description).toEqual("string");
          });
        });
    });
  });
  describe("GET /api/articles/:article_id", () => {
    test("404: Responds with an error if the article_id does not exist", () => {
      return request(app)
        .get("/api/articles/0")
        .expect(404)
        .then(({ body }) => {
          expect(body).toEqual({ error: "Not found" });
        });
    });
  });
});
