const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const process = require("process");

let sqlDb;

function initSqlDB() {
  // Locally we should launch the app with TEST=true to use SQLlite:

  process.env.TEST=true// node ./index.js

    
  if (process.env.TEST) {
    sqlDb = sqlDbFactory({
      client: "sqlite3",
      debug: true,
      connection: {
        filename: "./carecenterdb.sqlite"
      },
      useNullAsDefault: true
    });
  } else {
    sqlDb = sqlDbFactory({
      debug: true,
      client: "pg",
      connection: process.env.DATABASE_URL,
      ssl: true
    });
  }
}

function initDb() {
  return sqlDb.schema.hasTable("persons").then(exists => {
    if (!exists) {
      sqlDb.schema
        .createTable("persons", table => {
          table.increments("id");
          table.string("first_name");
          table.string("last_name");
          table.enum("gender", ["male", "female"]);
          table.integer("age").unsigned();
          table.string("nationality");
          table.string("role");
          table.string("phone_number");
          table.string("email");
          table.text("description");
        })
        .then(() => {
          return Promise.all(
            _.map(personsList, p => {
              delete p.id;
              return sqlDb("persons").insert(p);
            })
          );
        });
    } else {
      return true;
    }
  });
}

const _ = require("lodash");

let serverPort = process.env.PORT || 5000;

let personsList = require("./json/persondata.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /* Register REST entry point */
app.get("/persons", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("persons");

  if (sortby === "age") {
    myQuery = myQuery.orderBy("born", "asc");
  } else if (sortby === "-age") {
    myQuery = myQuery.orderBy("born", "desc");
  }
  myQuery
    .limit(limit)
    .offset(start)
    .then(result => {
      res.send(JSON.stringify(result));
    });
});

app.delete("/persons/:id", function(req, res) {
  let idn = parseInt(req.params.id);
  sqlDb("persons")
    .where("id", idn)
    .del()
    .then(() => {
      res.status(200);
      res.send({ message: "ok" });
    });
});

app.post("/persons", function(req, res) {
  let toappend = {
    name: req.body.name,
    tag: req.body.tag,
    born: req.body.born
  };
  sqlDb("persons")
    .insert(toappend)
    .then(ids => {
      let id = ids[0];
      res.send(_.merge({ id, toappend }));
    });
});

// app.use(function(req, res) {
//   res.status(400);
//   res.send({ error: "400", title: "404: File Not Found" });
// });

app.set("port", serverPort);

initSqlDB();
initDb();

/* Start the server on port 3000 */
app.listen(serverPort, function() {
  console.log(`Your app is ready at port ${serverPort}`);
});
