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

module.exports = {
  sanitizeMessageList,
  isValidNick,
};
