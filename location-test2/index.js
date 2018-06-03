const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const process = require("process");

let sqlDb;

function initSqlDB() {
    /* Locally we should launch the app with TEST=true to use SQLlite:

       > TEST=true node ./index.js

    */
    if (true) { //process.env.TEST) {
        sqlDb = sqlDbFactory({
            client: "sqlite3",
            debug: true,
            connection: {
                filename: "./other/care_centre.sqlite"
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
    return sqlDb.schema.hasTable("locations").then(exists => {
        if (!exists) {
            sqlDb.schema
                .createTable("locations", table => {
                table.increments();
                table.string("name");
                table.string("desc");
                table.string("img_url");
                table.string("map_code");
                table.string("country");
                table.string("city");
                table.integer("postal_code").unsigned();
                table.string("adress");
                table.string("mon_thu_open");
                table.string("fri_open");
                table.string("sat_sun_open");
                table.string("events");
            })
                .then(() => {
                return Promise.all(
                    _.map(locationsList, l => {
                        delete l.id;
                        return sqlDb("locations").insert(l);
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

let locationsList = require("./other/json/locationdata.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// /* Register REST entry point */

app.get("/locations", function(req, res) {
    res.sendFile(__dirname + "/public/pages/location_index.html");
});

app.get("/location_card_info", function(req, res) {
    let myQuery = sqlDb("locations");

    myQuery.select(["name", "desc", "img_url"]).then(result => {
        res.send(result);
    });

    console.log("Tutto bene");


    /*
    let sql = 'SELECT name, desc, img_url FROM locations';
    sqlDb.all(sql, [], (err, rows) => {
        if (err) {
            console.log("Error occured");
        }
        else {
            console.log(rows[2].name);
        }
    });
    */
});

/*

For pets DB

app.get("/pets", function(req, res) {
  let start = parseInt(_.get(req, "query.start", 0));
  let limit = parseInt(_.get(req, "query.limit", 5));
  let sortby = _.get(req, "query.sort", "none");
  let myQuery = sqlDb("pets");

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

app.delete("/pets/:id", function(req, res) {
  let idn = parseInt(req.params.id);
  sqlDb("pets")
    .where("id", idn)
    .del()
    .then(() => {
      res.status(200);
      res.send({ message: "ok" });
    });
});

app.post("/pets", function(req, res) {
  let toappend = {
    name: req.body.name,
    tag: req.body.tag,
    born: req.body.born
  };
  sqlDb("pets")
    .insert(toappend)
    .then(ids => {
      let id = ids[0];
      res.send(_.merge({ id, toappend }));
    });
});

*/

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
