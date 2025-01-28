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
  describe.only("GET /api/topics", () => {
    test("200: Responds with an array", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(Array.isArray(topics)).toEqual(true);
        });
    });
    test("200: Responds with an array containing an object", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(typeof topics[0]).toEqual("object");
        });
    });
    test("200: Responds with an object called topic which cantains an array of objects.", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            topics: [
              {
                description: "The man, the Mitch, the legend",
                slug: "mitch",
              },
              {
                description: "Not dogs",
                slug: "cats",
              },
              {
                description: "what books are made of",
                slug: "paper",
              },
            ],
          });
        });
    });
  });
});
