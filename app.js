const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
var isValid = require("date-fns/isValid");

// Define The Path for Database
const databasePath = path.join(__dirname, "todoApplication.db");

// Calling Express and app JSON
const app = express();
app.use(express.json());

// Initialization The Database And Server
let database = null;

const initializationDatabaseAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () =>
      console.log("Server is Running at: http://localhost:3000/")
    );
  } catch (error) {
    console.log(`Database Error: '${error.message}'`);
    process.exit(1);
  }
};
initializationDatabaseAndServer();

// API 1
const hasAllProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined &&
    requestQuery.priority !== undefined &&
    requestQuery.status !== undefined &&
    requestQuery.due_date !== undefined
  );
};

const hasOnlystatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};

const hasOnlyPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};

const hasStatusAndPriority = (requestQuery) => {
  return (
    requestQuery.priority !== undefined && requestQuery.status !== undefined
  );
};

const hasCategoryAndStatus = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.status !== undefined
  );
};

const hasOnlyCategory = (requestQuery) => {
  return requestQuery.category !== undefined;
};

const hasCategoryAndPriority = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};

app.get("/todos/", async (request, response) => {
  let data = null;
  let getTodoQuery = "";
  const { search_q = "", category, priority, status, due_date } = request.query;

  switch (true) {
    case hasAllProperty(request.query):
      getTodoQuery = `
          SELECT *
          FROM todo
          WHERE todo LIKE '%${search_q}%' AND 
                category = '${category}' AND
                priority = '${priority}' AND
                status = '${status}' AND 
                due_date = '${due_date}';`;
      break;
    case hasOnlystatus(request.query):
      getTodoQuery = `
          SELECT *
          FROM todo
          WHERE todo LIKE '%${search_q}%' AND 
                status = '${status}';`;
      break;
    case hasOnlyPriority(request.query):
      getTodoQuery = `
          SELECT *
          FROM todo
          WHERE todo LIKE '%${search_q}%' AND 
                priority = '${priority}';`;
      break;
    case hasStatusAndPriority(request.query):
      getTodoQuery = `
          SELECT *
          FROM todo
          WHERE todo LIKE '%${search_q}%' AND 
                priority = '${priority}' AND
                status = '${status}';`;
      break;
    case hasCategoryAndStatus(request.query):
      getTodoQuery = `
          SELECT *
          FROM todo
          WHERE todo LIKE '%${search_q}%' AND 
                category = '${category}' AND
                status = '${status}';`;
      break;
    case hasOnlyCategory(request.query):
      getTodoQuery = `
          SELECT *
          FROM todo
          WHERE todo LIKE '%${search_q}%' AND 
                category = '${category}';`;
      break;
    case hasCategoryAndPriority(request.query):
      getTodoQuery = `
          SELECT *
          FROM todo
          WHERE todo LIKE '%${search_q}%' AND 
                category = '${category}' AND
                priority = '${priority}';`;
      break;
    default:
      getTodoQuery = `
          SELECT *
          FROM todo
          WHERE todo LIKE '%${search_q}%';`;
      break;
  }
  data = await database.all(getTodoQuery);
  response.send(data);
});
