const { isValidNick } = require("../sanitizer");
const { randomKey } = require("../utils");

function createAccount(db) {
  async function post(req, res) {
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
  }

  return {
    post,
  };
}

module.exports = createAccount;
