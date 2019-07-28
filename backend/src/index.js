require("dotenv").config({ path: "variables.env" });

const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// TODO User express midddleware for cookies (JWT)
// TODO User express midddleware for current user

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FROTEND_URL
    }
  },
  data => {
    console.log(`Server is now running http://localhost:${data.port}`);
  }
);
