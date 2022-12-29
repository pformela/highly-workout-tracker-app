import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import neo4j from "neo4j-driver";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const app = express();

const driver = neo4j.driver(
  "neo4j://localhost:7687",
  neo4j.auth.basic("neo4j", "test1234")
);

app.use(bodyParser.json());
app.use(cors());

const server = app.listen(4000, () => {
  console.log("Listening on port %s...", server.address().port);
});

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;
  const sanitizedEmail = email.toLowerCase();

  const generatedUserId = uuidv4();
  const hashedPassword = await bcrypt.hash(password, 10);

  const emailSession = driver.session();
  const existingEmail = emailSession
    .run(
      `
      MATCH (u:User {email: "${sanitizedEmail}"})
      RETURN u
      `
    )
    .then((result) => {
      if (result.records[0]) {
        res.status(409).send(existingEmail.toString());
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .then((res) => {
      emailSession.close();
    });

  const userSession = driver.session();
  const existingUser = userSession
    .run(
      `
      MATCH (u:User {username: "${username}"})
      RETURN u
      `
    )
    .then((result) => {
      if (result.records[0]) {
        res.status(409).send("User with this name already exists.");
      }
    })
    .catch((error) => {
      console.log(error);
    })
    .then((res) => {
      userSession.close();
    });

  const data = {
    id: generatedUserId,
    username,
    hashedPassword: hashedPassword,
    email: sanitizedEmail,
  };

  const newUserSession = driver.session();

  newUserSession
    .run(
      `
      CREATE (u:User {user_id: "${data.id}", username: "${data.username}", hashed_password: "${data.hashedPassword}", email: "${data.email}"})
      RETURN u
      `
    )
    .then((result) => {
      newUserSession.close();
      const token = jwt.sign(
        { username: data.username, email: data.email },
        "secret123",
        {
          expiresIn: 60 * 60 * 3,
        }
      );
      res.status(201).json({ token, userId: data.id });
    })
    .catch((error) => {
      console.log(error);
    });
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
            res
              .status(201)
              .json({ token, userId: user.user_id, username: user.username });
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

app.get("/users", async (req, res) => {
  const session = driver.session();
  session
    .run(
      `
      MATCH (u:User)
      RETURN u
      `
    )
    .then((result) => {
      session.close();
      res.send(result.records.map((r) => r.get("u").properties));
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
      MATCH (ex:Exercise${type ? ":" + type : ""}${muscle ? ":" + muscle : ""}${
        difficulty ? ":" + difficulty : ""
      }) 
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
      MATCH (ex:Exercise${type ? ":" + type : ""}${muscle ? ":" + muscle : ""}${
        difficulty ? ":" + difficulty : ""
      }) 
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
