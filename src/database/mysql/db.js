const { Sequelize, where } = require("sequelize");
const { INTEGER, CHAR, TEXT, DATE, STRING } = require("sequelize");
const createDatabaseTemplate = require("../db_template");

require("dotenv").config({ path: "./db.env" });

const {
  DATABASE_NAME,
  DATABASE_USER_NAME,
  DATABASE_USER_PASSWORD,
  DATABASE_HOST,
  DATABASE_PORT,
} = process.env;

async function createDatabase() {
  const database = new Sequelize(
    DATABASE_NAME,
    DATABASE_USER_NAME,
    DATABASE_USER_PASSWORD,
    {
      dialect: "mysql",
      host: DATABASE_HOST,
      port: DATABASE_PORT,
    }
  );

  const Accounts = database.define("accounts", {
    id: {
      type: CHAR(32),
      primaryKey: true,
      allowNull: false,
    },
    nick: {
      type: STRING(12),
      allowNull: false,
    },
  });

  const Messages = database.define("messages", {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    content: TEXT,
    timestamp: {
      type: DATE,
      allowNull: false,
    },
  });

  Accounts.hasMany(Messages, { onDelete: "CASCADE" });
  Messages.belongsTo(Accounts);

  await database.sync();

  const db = createDatabaseTemplate();

  db.createAccount = async function (id, nick) {
    try {
      await Accounts.create({ id, nick });
      return true;
    } catch {
      return false;
    }
  };

  db.getAccount = async function (id) {
    return await Accounts.findByPk(id);
  };

  db.updateAccount = async function (id, newNick) {
    const account = await getAccount(id);

    if (account) {
      account.nick = newNick;
      await account.save();

      return true;
    }

    return false;
  };

  db.deleteAccout = async function (id) {
    const account = await getAccount(id);

    if (account) {
      await account.destroy();

      return true;
    }

    return false;
  };

  db.createMessage = async function (accountId, content, timestamp) {
    try {
      await Messages.create({ accountId, content, timestamp });
      return true;
    } catch {
      return false;
    }
  };

  db.getMessages = async function (startTime) {
    var where = undefined;

    if (startTime) {
      where = {
        startTime: {
          gt: startTime,
        },
      };
    }

    const messages = await Messages.findAll({
      where,
      include: {
        model: Accounts,
        attributes: ["nick"],
      },
    });

    return messages;
  };

  db.updateMessage = async function (accountId, messageId, newContent) {
    const message = await Messages.findByPk(messageId);

    if (message) {
      message.content = newContent;
      await message.save();

      return true;
    }

    return false;
  };

  db.deleteMessage = async function (accountId, messageId) {
    const message = Messages.findByPk(messageId);

    if (message) {
      await message.destroy();

      return true;
    }

    return false;
  };

  return db;
}

module.exports = createDatabase;
