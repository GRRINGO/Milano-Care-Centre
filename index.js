const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const sqlDbFactory = require("knex");
const process = require("process");

let sqlDb;

function initSqlDB() {
    // Locally we should launch the app with TEST=true to use SQLlite:

    //process.env.TEST=false// node ./index.js


    if (true) {
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

    sqlDb.schema.hasTable("personservice").then(exists => {
        if (!exists) {
            sqlDb.schema
                .createTable("personservice", table => {
                table.increments("id");
                table.integer("service_id").unsigned();
                table.integer("person_id").unsigned();
            })
                .then(() => {
                return Promise.all(
                    _.map(personserviceList, ps => {
                        delete ps.id;
                        return sqlDb("personservice").insert(ps);
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
let personserviceList = require("./json/personservicedata.json");

app.use(express.static(__dirname + "/public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));







// /* Register REST entry point */


// --- LOCATIONS ---

app.get("/locations", function(req, res) {
    res.sendFile(__dirname + "/public/pages/location_index.html");
});

app.get("/info/location_card_info", function(req, res) {
    let myQuery = sqlDb("locations");

    myQuery.select(["name", "desc", "img_url"]).then(result => {
        res.send(result);
    });
});

app.get("/info/location_names", function(req, res) {
    let myQuery = sqlDb("locations");

    myQuery.select(["name"]).then(result => {
        res.send(result);
    });
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
        res.sendFile(__dirname + "/public/pages/404_not_found.html")
    }
});

app.get("/info/location/:id/service", function(req, res) {

    sqlDb("services")
    .join("locationservice", "services.id", "=", "locationservice.service_id")
    .where( {
        location_id: req.params.id
    })
    .select(["services.name", "services.id"])
    .then(result => {
        res.send(result);
    })
});

// --- PERSONS ---

app.get("/persons", function(req, res) {
    res.sendFile(__dirname + "/public/pages/person_index.html");
});

app.get("/info/person_card_info", function(req, res) {
    let myQuery = sqlDb("persons");

    myQuery.select(["first_name", "last_name", "desc", "img_url"]).then(result => {
        res.send(result);
    });
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
        res.sendFile(__dirname + "/public/pages/404_not_found.html")
    }
});

app.get("/info/person/:id/service", function(req, res) {
    
    sqlDb("services")
    .join("personservice", "services.id", "=", "personservice.service_id")
    .where( {
        person_id: req.params.id
    })
    .select(["services.name", "services.id"])
    .then(result => {
        res.send(result);
    })
});

// --- SERVICES ---

app.get("/services", function(req, res) {
    res.sendFile(__dirname + "/public/pages/service_index.html");
});

app.get("/info/service_card_info", function(req, res) {
    let myQuery = sqlDb("services");

    myQuery.select(["name", "desc", "img_url"]).then(result => {
        res.send(result);
    });
});

app.get("/info/service_names", function(req, res) {
    let myQuery = sqlDb("services");

    myQuery.select(["name", "desc"]).then(result => { // For some reason the result is ordered alphabetically if just the name is selected
        res.send(result);
    });
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
        res.sendFile(__dirname + "/public/pages/404_not_found.html")
    }
});

app.get("/info/service/:id/person", function(req, res) {
    
    sqlDb("persons")
    .join("personservice", "persons.id", "=", "personservice.person_id")
    .where( {
        service_id: req.params.id
    })
    .select(["persons.first_name", "persons.last_name", "persons.id"])
    .then(result => {
        res.send(result);
    })
});

app.get("/info/service/:id/location", function(req, res) {
    
    sqlDb("locations")
    .join("locationservice", "locations.id", "=", "locationservice.location_id")
    .where( {
        service_id: req.params.id
    })
    .select(["locations.name", "locations.id"])
    .then(result => {
        res.send(result);
    })
});

// --- OTHER ---


app.get("/who_we_are", function(req, res) {
    res.sendFile(__dirname + "/public/pages/who_we_are.html")
});

app.get("/contact_us", function(req, res) {
    res.sendFile(__dirname + "/public/pages/contact_us.html")
});

app.get("/info/location_service_coupling", function(req, res) {
    let myQuery = sqlDb("locationservice");

    myQuery.select(["service_id", "location_id"]).then(result => {
        res.send(result);
    });
});







 app.use(function(req, res) {
   res.status(404);
   res.sendFile(__dirname + "/public/pages/404_not_found.html");
 });

app.set("port", serverPort);

initSqlDB();
initDb();

/* Start the server on port 3000 */
app.listen(serverPort, function() {
    console.log(`Your app is ready at port ${serverPort}`);
});
