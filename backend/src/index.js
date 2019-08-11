const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: "variables.env" });

const createServer = require("./createServer");
const db = require("./db");

const server = createServer();

// middleware for cookies (JWT)
server.express.use(cookieParser());

// middleware for current user (user id on each request)
server.express.use((req, res, next) => {
  const { token } = req.cookies;

  if (token) {
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    req.userId = userId;
  }

  next();
});

// middleware for current user
server.express.use(async (req, res, next) => {
  const { userId } = req;

  if (!userId) {
    return next();
  }

  const user = await db.query.user(
    { where: { id: userId } },
    "{id, permissions, email, name}"
  );

  req.user = user;

  next();
});

server.start(
  {
    cors: {
      credentials: true,
      origin: true
    }
  },
  (data) => {
    console.log(`Server is now running http://localhost:${data.port}`);
  }
);
