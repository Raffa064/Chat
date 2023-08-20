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
