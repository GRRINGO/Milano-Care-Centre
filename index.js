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

//Services not done with arrays since sqlite3 doesn't support them.
function initDb() {
    sqlDb.schema.hasTable("persons").then(exists => {
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
                table.text("desc");
                table.string("img_url");
                table.string("service0").references("name").inTable("services").onUpdate("CASCADE").onDelete("SET NULL");
                table.string("service1").references("name").inTable("services").onUpdate("CASCADE").onDelete("SET NULL");
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

    sqlDb.schema.hasTable("services").then(exists => {
        if (!exists) {
            sqlDb.schema
                .createTable("services", table => {
                table.increments("id");
                table.string("name").unique();
                table.string("desc");
                table.string("img_url");
                table.string("details");
            })
                .then(() => {
                return Promise.all(
                    _.map(servicesList, s => {
                        delete s.id;
                        return sqlDb("services").insert(s);
                    })
                );
            });
        } else {
            return true;
        }
    });

    sqlDb.schema.hasTable("locations").then(exists => {
        if (!exists) {
            sqlDb.schema
                .createTable("locations", table => {
                table.increments("id");
                table.string("name");
                table.string("desc");
                table.string("img_url");
                table.string("map_code");
                table.string("country");
                table.string("city");
                table.integer("postal_code").unsigned();
                table.string("address");
                table.string("mon_thu_open");
                table.string("fri_open");
                table.string("sat_sun_open");
                table.string("events");
                table.string("service0").references("name").inTable("services").onUpdate("CASCADE").onDelete("SET NULL");
                table.string("service1").references("name").inTable("services").onUpdate("CASCADE").onDelete("SET NULL");
                table.string("service2").references("name").inTable("services").onUpdate("CASCADE").onDelete("SET NULL");

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
    
    sqlDb.schema.hasTable("locationservice").then(exists => {
        if (!exists) {
            sqlDb.schema
                .createTable("locationservice", table => {
                table.increments("id");
                table.integer("service_id").unsigned();
                table.integer("location_id").unsigned();
            })
                .then(() => {
                return Promise.all(
                    _.map(locationserviceList, ls => {
                        delete ls.id;
                        return sqlDb("locationservice").insert(ls);
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
let locationsList = require("./json/locationdata.json");
let servicesList = require("./json/servicedata.json");
let locationserviceList = require("./json/locationservicedata.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));





// /* Register REST entry point */

// --- LOCATIONS ---

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

app.get("/location_names", function(req, res) {
    let myQuery = sqlDb("locations");

    myQuery.select(["name"]).then(result => {
        res.send(result);
    });
    console.log("Tutto bene");
});

app.get("/locations/:id", function(req, res) {
    res.sendFile(__dirname + "/public/pages/location_page.html")
});

app.get("/info/locations/:id", function(req, res) {
    if (req.get('internal')) {
        let myQuery = sqlDb("locations");
        myQuery.select(["*"]).where('id', req.params.id).then(result => {
            res.send(result);
        });
    } else {
        res.sendFile(__dirname + "/public/pages/location_page.html")
    }

    console.log("Tutto bene");

});

// --- PERSONS ---

app.get("/persons", function(req, res) {
    res.sendFile(__dirname + "/public/pages/person_index.html");
});

app.get("/person_card_info", function(req, res) {
    let myQuery = sqlDb("persons");

    myQuery.select(["first_name", "last_name", "desc", "img_url"]).then(result => {
        res.send(result);
    });
    console.log("Tutto bene");
});

app.get("/persons/:id", function(req, res) {
    res.sendFile(__dirname + "/public/pages/person_page.html")
});

app.get("/info/persons/:id", function(req, res) {
    if (req.get('internal')) {
        let myQuery = sqlDb("persons");
        myQuery.select(["*"]).where('id', req.params.id).then(result => {
            res.send(result);
        });
    } else {
        res.sendFile(__dirname + "/public/pages/person_page.html")
    }

    console.log("Tutto bene");

});

// --- SERVICES ---

app.get("/services", function(req, res) {
    res.sendFile(__dirname + "/public/pages/service_index.html");
});

app.get("/service_card_info", function(req, res) {
    let myQuery = sqlDb("services");

    myQuery.select(["name", "desc", "img_url"]).then(result => {
        res.send(result);
    });
    console.log("Tutto bene");
});

app.get("/service_names", function(req, res) {
    let myQuery = sqlDb("services");

    myQuery.select(["name", "desc"]).then(result => { // For some reason the result is ordered alphabetically if just the name is selected
        res.send(result);
    });
    console.log("Tutto bene");
});

app.get("/services/:id", function(req, res) {
    res.sendFile(__dirname + "/public/pages/service_page.html")
});

app.get("/info/services/:id", function(req, res) {
    if (req.get('internal')) {
        let myQuery = sqlDb("services");
        myQuery.select(["name", "desc", "details"]).where('id', req.params.id).then(result => {
            res.send(result);
        });
    } else {
        res.sendFile(__dirname + "/public/pages/service_page.html")
    }

    console.log("Tutto bene");

});

// --- OTHER ---


app.get("/who_we_are", function(req, res) {
    res.sendFile(__dirname + "/public/pages/who_we_are.html")
});

app.get("/contact_us", function(req, res) {
    res.sendFile(__dirname + "/public/pages/contact_us.html")
});

app.get("/location_service_coupling", function(req, res) {
    let myQuery = sqlDb("locationservice");

    myQuery.select(["service_id", "location_id"]).then(result => {
        res.send(result);
    });
    console.log("Tutto bene");
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
