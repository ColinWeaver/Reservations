const { PORT = 5000 } = process.env;

const app = require("./app");
const knex = require("./db/connection");

knex.migrate
  .latest()
  .then((migrations) => {
    app.listen(PORT, listener);
  })
  .catch((error) => {
    knex.destroy();
  });

function listener() {
  return null;
}

//I removed the logging in this file but kept the rest just in case
