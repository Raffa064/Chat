const express = require("express");
const app = express();
const createRouter = require('./routes/router')

const DATABASE_TEMPLATE = "./database/" + process.argv[2] + "/db";
console.log("Using data from " + DATABASE_TEMPLATE);
const createDatabase = require(DATABASE_TEMPLATE);

(async () => {
  const db = await createDatabase();
  // Setup server
  app.use(express.json());
  app.use("/", express.static("static"));
  app.use(createRouter(db))

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Server started on port: " + PORT);
  });

})();
