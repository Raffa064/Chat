# About

This project is a global web chat made with Node.js, MySQL, Sequelize, and React, which I created as my first project involving a real database.

The project contains 2 database modes:

- **Mock** which uses javascript objects to store data
- **MySQL** which uses Sequlize to store data

The mock option is suitable for testing the project without the need to launch a database server, but it's not suitable for actual usage.

> I hardly recommend not deploying **mock** to production!

At this moment, the project has no deployed version, but you can deploy locally with only few steps, that I describe on the next section.  

## How to run locally

To run locally, simply execute the setup script (to define environment variables), and exec the command bellow:

```shell
  bash setup.sh
```

After it, run the project with:

```
  npm start -- "mysql"
```

Or, if you want to do tests (nodemon):

```
  npm test -- "mysql"
```

> You can replace "mysql" to mock if you haven't a database.<br>**Mock is only for tests!**
