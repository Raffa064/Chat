function notImplemented(func) {
  throw new Error('Function not implementented: "' + func + '"');
}

function createDatabaseTemplate() {
  const template = {
    createAccount: (id, nick) => {
      notImplemented("createAccount");
    },
    getAccount: (id) => {
      notImplemented("getAccount");
    },
    updateAccount: (id, newNick) => {
      notImplemented("updateAccount");
    },
    deleteAccout: (id) => {
      notImplemented("deleteAccout");
    },
    createMessage: (accountId, content, timestamp) => {
      notImplemented("createMessage");
    },
    getMessages: (startTime) => {
      notImplemented("getMessages");
    },
    updateMessage: (accountId, messageId, newContent) => {
      notImplemented("updateMessage");
    },
    deleteMessage: (accountId, messageId) => {
      notImplemented("deleteMessage");
    },
  };

  return template;
}

module.exports = createDatabaseTemplate;
