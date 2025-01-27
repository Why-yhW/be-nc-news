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
});
