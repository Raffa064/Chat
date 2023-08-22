const express = require("express");

function createRouter(db) {
  const router = express.Router();

  const createAccount = require("./create-account")(db);
  router.post("/create-account", createAccount.post);

  const messages = require("./messages")(db);
  router.get("/messages", messages.get);
  router.post("/messages", messages.post);

  return router;
}

module.exports = createRouter;
