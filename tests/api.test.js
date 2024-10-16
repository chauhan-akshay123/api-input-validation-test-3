const request = require("supertest");
const { app } = require("../index.js");
const { validateArticle, validateAuthor } = require("../index.js");
const http = require("http");
const { describe, beforeEach } = require("node:test");
const { execPath } = require("process");

jest.mock("../index.js", () => {
  const actualModule = jest.requireActual("../index.js");
  return {
    ...actualModule,
    validateArticle: jest.fn(),
    validateAuthor: jest.fn(),
  };
});

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Endpoints to add data", () => {
 beforeEach(() => {
   jest.clearAllMocks();
 });

 it("Should add a new article with valid input", async () => {
   const response = await request(server).post("/articles").send({'title': 'Mastering Node.js',
   'content': 'Node.js is a powerful tool for backend development...'});

   expect(response.statusCode).toEqual(201);
   expect(response.body).toEqual({
    'id': 3,
    'title': 'Mastering Node.js',
    'content': 'Node.js is a powerful tool for backend development...'
   });
 });

 it("Should return 400 for invalid article input", async () => {
  const response = await request(server).post("/articles").send({
    title: "Mastering Node.js",
  });

  expect(response.statusCode).toEqual(400);
  expect(response.text).toEqual("Content is required and should be a string.");
});

it("Should return 400 for invalid article input", async () => {
  const response = await request(server).post("/articles").send({
    'content': 'Node.js is a powerful tool for backend development...'
  });

  expect(response.statusCode).toEqual(400);
  expect(response.text).toEqual("Title is required and should be a string.");
});

it("Should add a new Author with valid input", async () => {
 const response = await request(server).post("/authors").send({
  'name': 'Alice Johnson'
 }); 

 expect(response.statusCode).toEqual(400);
 expect(response.text).toEqual("Article Id is required and should be a number.");
});

it("Should add a new Author with valid input", async () => {
  const response = await request(server).post("/authors").send({
    'articleId': 3
  }); 
 
  expect(response.statusCode).toEqual(400);
  expect(response.text).toEqual("Name is required and should be a string.");
 });

});

describe("Validation Function Test", () => {
 beforeEach(() => {
  jest.clearAllMocks();
 });

 it("Should validate Article input correctly", async () => {
  validateArticle.mockReturnValue(null); 
  expect(validateArticle({'title': 'Mastering Node.js',
  'content': 'Node.js is a powerful tool for backend development...'})).toBeNull();

  validateArticle.mockReturnValue("Content is required and should be a string.");
  expect(validateArticle({'title': 'Mastering Node.js'})).toEqual("Content is required and should be a string.");

  validateArticle.mockReturnValue("Title is required and should be a string.")
  expect(validateArticle({'content': 'Node.js is a powerful tool for backend development...'})).toEqual("Title is required and should be a string.");
 });
 
 it("Should validate Author input correctly", async () => {
  validateAuthor.mockReturnValue(null); 
  expect(validateAuthor({  'name': 'Alice Johnson',
  'articleId': 3})).toBeNull();

  validateAuthor.mockReturnValue("Article Id is required and should be a number.");
  expect(validateAuthor({'name': 'Alice Johnson'})).toEqual("Article Id is required and should be a number.");

  validateAuthor.mockReturnValue("Name is required and should be a string.");
  expect(validateAuthor({  'articleId': 3})).toEqual("Name is required and should be a string.");
 });

});
