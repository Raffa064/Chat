const { sanitizeMessageList } = require('../sanitizer')

function messages(db) {
  async function get(req, res) {
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
  }

  async function post(req, res) {
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
  }

  return {
    get,
    post,
  };
}

module.exports = messages;
