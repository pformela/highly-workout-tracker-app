require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const neo4j = require("neo4j-driver");
const { uuid } = require("uuidv4");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");

const app = express();
const path = require("path");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_LOGIN, process.env.NEO4J_PASSWORD)
);

app.use(express.json());
app.use(cookieParser());
app.use("/", express.static(path.join(__dirname, "public")));
app.use("/", require("./routes/root"));
app.use(bodyParser.json());
app.use(cors(corsOptions));

app.use("/users", require("./routes/userRoutes"));

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", async (req, res) => {
  const { username, password, email } = req.body;

  const session = driver.session();

  session
    .run(
      `
      MATCH (u:User {email: "${email}"})
      RETURN u
      `
    )
    .then((result) => {
      session.close();
      try {
        const user = result.records[0].get("u").properties;
        bcrypt.compare(password, user.hashed_password, (err, result) => {
          if (result) {
            const token = jwt.sign(
              { username: username, email: email },
              "secret123",
              {
                expiresIn: 60 * 60 * 3,
              }
            );
            res.status(201).json({
              token,
              userId: user.user_id,
              username: user.username,
              email: user.email,
            });
          } else {
            res.status(400).send("Invalid credentials.");
          }
        });
      } catch (error) {
        res.status(400).send("No user registered under this email.");
      }
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/getExercises", async (req, res) => {
  const name = req.query.name ? req.query.name : "";
  const type = req.query.type ? req.query.type : "";
  const muscle = req.query.muscle ? req.query.muscle : "";
  const difficulty = req.query.difficulty ? req.query.difficulty : "";
  const offset = req.query.offset ? req.query.offset : 0;

  const session = driver.session();

  session
    .run(
      `
            MATCH (ex:Exercise${type ? ":" + type : ""}${
        muscle ? ":" + muscle : ""
      }${difficulty ? ":" + difficulty : ""}) 
            WHERE ex.name CONTAINS "${name}" 
            RETURN ex 
            SKIP ${offset} LIMIT 25`
    )
    .then((exerciseResult) => {
      session.close();
      const newSession = driver.session();
      newSession
        .run(
          `
                MATCH (ex:Exercise${type ? ":" + type : ""}${
            muscle ? ":" + muscle : ""
          }${difficulty ? ":" + difficulty : ""}) 
                WHERE ex.name CONTAINS "${name}" 
                RETURN count(ex) as count`
        )
        .then((countResult) => {
          res.send({
            result: exerciseResult.records.map((r) => {
              return { ...r.get("ex").properties, labels: r.get("ex").labels };
            }),
            count: countResult.records[0].get("count").low,
          });
        })
        .catch((error) => {
          console.log(error);
        })
        .then(() => {
          newSession.close();
        });
    })
    .catch((error) => {
      console.log(error);
    });
});

app.get("/api/getNumberOfExercises", (req, res) => {
  const name = req.query.name ? req.query.name : "";
  const type = req.query.type ? req.query.type : "";
  const muscle = req.query.muscle ? req.query.muscle : "";
  const difficulty = req.query.difficulty ? req.query.difficulty : "";
  const offset = req.query.offset ? req.query.offset : 0;

  const session = driver.session();

  session
    .run(
      `
        MATCH (ex:Exercise${type ? ":" + type : ""}${
        muscle ? ":" + muscle : ""
      }${difficulty ? ":" + difficulty : ""}) 
        WHERE ex.name CONTAINS "${name}" 
        RETURN count(ex) as count`
    )
    .then((res) => {
      console.log(res.records);
      res.send(res.records);
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      session.close();
    });
});

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not found" });
  } else {
    res.type("txt").send("404 Not found");
  }
});

const server = app.listen(4000, () => {
  console.log("Listening on port %s...", server.address().port);
});
