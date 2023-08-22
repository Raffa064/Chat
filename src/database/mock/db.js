/*
  To work with the real database, you'll need to use Date Objects
  on the  database and UTC timestamps in the client, so, user
  timestamps needs to be converted to Date on resquests.

  userTime = databseTime.getTime()
  databaseTime = new Date(userTime)
*/

const { readFile, writeFile, existsSync } = require("fs");
const createDatabaseTemplate = require("../db_template");

function injectTestData(db) {
  const ids = [
    "00000000000000000000000000000000",
    "11111111111111111111111111111111",
    "22222222222222222222222222222222",
  ];

  for (let i = 0; i < ids.length; i++) {
    db.createAccount(ids[i], "TesteUser@" + 1);

    const messageAmount = Math.floor(Math.random() * 5);
    for (let j = 0; j < messageAmount; j++) {
      db.createMessage(ids[i], "Test message", new Date());
    }
  }
}

 function createDatabase() {
  var accounts = [];
  var messages = [];
  messages.incrementalId = 0; // AUTO_INCREMENT

  const db = createDatabaseTemplate();

  db.createAccount =  function (id, nick) {
    const account = db.getAccount(id);

    if (!account) {
      //Prevent duplication
      accounts.push({ id, nick });
      db.save();
      return true;
    }

    return false;
  };

  db.getAccount =  function (id) {
    return accounts.find((account) => {
      return account.id === id;
    });
  };

  db.updateAccount =  function (id, newNick) {
    const account = db.getAccount(id);

    if (account) {
      account.nick = newNick;
      db.save();

      return true;
    }

    return false;
  };

  db.deleteAccout =  function (id) {
    const account = db.getAccount(id);

    if (account) {
      messages = messages.filter((msg) => {
        return msg.accountId !== id; // Delete user messages (CASCADE)
      });

      const index = accounts.indexOf(account);
      accounts.splice(index, 1);
      db.save();

      return true;
    }

    return false;
  };

  db.createMessage =  function (accountId, content, timestamp) {
    const account = db.getAccount(accountId);

    if (account) {
      messages.push({
        id: messages.incrementalId++,
        accountId,
        content,
        timestamp: timestamp.getTime(),
      });
      db.save();

      return true;
    }

    return false;
  };

  db.getMessages =  function (startTime) {
    //NOTE: it will return unsanitized data (accountId)!
    var result = messages;

    if (startTime) {
      //startTime is a Date obj
      const startTime_millis = startTime.getTime();

      result = messages.filter((message) => {
        return message.timestamp > startTime_millis;
      });
    }

    return result.map( (msg) => {
      const account =  db.getAccount(msg.accountId);

      return {
        id: msg.id,
        content: msg.content,
        accountId: msg.accountId,
        account: {
          nick: account.nick,
        },
        timestamp: new Date(msg.timestamp),
      };
    });
  };

  db.updateMessage =  function (accountId, messageId, newContent) {
    const message = messages.find((message) => {
      return message.accountId === accountId && message.id === messageId;
    });

    if (message) {
      message.content = newContent;
      db.save();

      return true;
    }

    return false;
  };

  db.deleteMessage =  function (accountId, messageId) {
    const message = messages.find((message) => {
      return message.accountId === accountId && message.id === messageId;
    });

    if (message) {
      const index = messages.indexOf(message);
      messages.splice(index, 1);
      db.save();

      return true;
    }

    return false;
  };

  db.save = function () {
    const data = JSON.stringify({
      messages,
      accounts,
    });
    writeFile("./mock-data", data, "utf8", (err, data) => {
      if (err) {
        console.log("Error on save");
      }
    });
  };

  if (existsSync("./mock-data")) {
    console.log("LOADING MOCK DATA");
    readFile("./mock-data", "utf8", (err, data) => {
      const json = JSON.parse(data);
      messages = json.messages;
      accounts = json.accounts;
    });
  } else {
    console.log("INJECTING TEST DATA");
    injectTestData(db);
  }

  return db;
}

module.exports = createDatabase;
