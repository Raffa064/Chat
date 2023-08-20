const express = require("express");
const app = express();

const DATABASE_TEMPLATE = "./database/" + process.argv[2] + "/db";
console.log("Using data from " + DATABASE_TEMPLATE);
const createDatabase = require(DATABASE_TEMPLATE);

(async () => {
  const db = await createDatabase();
  // Setup server
  app.use(express.json());
  app.use("/", express.static("static"));

  app.post("/create-account", async (req, res) => {
    console.log("POST create-account");

    const { nick } = req.body;

    if (isValidNick(nick)) {
      const id = randomKey(32);
      const sucess = await db.createAccount(id, nick);

      if (sucess) {
        console.log({ id, nick });
        res.send({ id, nick });
        return;
      }

      res.sendStatus(500); // Internal erver error (Hash collision?)
      return;
    }

    res.sendStatus(400); // Bad request (Invalid or undefined nick)
  });

  app.get("/messages", async (req, res) => {
    console.log("GET messages");

    const { startTime } = req.body;

    var messages = await db.getMessages(
      startTime ? new Date(startTime) : undefined
    );

    messages = sanitizeMessageList(messages);

    res.send({
      timestamp: Date.now(),
      messages,
    });
  });

  app.post("/messages", async (req, res) => {
    console.log("POST messages");

    const { accountId, content } = req.body;

    if (accountId && content) {
      const sucess = await db.createMessage(accountId, content, new Date());

      if (sucess) {
        res.sendStatus(200);
        return;
      }

      res.sendStatus(400); // Bad request (unknown id)
      return;
    }

    res.sendStatus(500); // Bad request
  });

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log("Server started on port: " + PORT);
  });

  function sanitizeMessageList(messages) {
    return messages.map((msg) => {
      return {
        id: messages.id,
        content: msg.content,
        halfId: msg.accountId.substring(8, 16),
        nick: msg.account.nick,
        timestamp: msg.timestamp.getTime(),
      };
    });
  }

  function isValidNick(nick) {
    if (nick) {
      return nick.length <= 12;
    }

    return false;
  }

  function randomKey(size) {
    var key = "";
    for (let i = 0; i < size; i++) {
      key += Math.floor(Math.random() * 16).toString(16);
    }

    return key;
  }
})();
