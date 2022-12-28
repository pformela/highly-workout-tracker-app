import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import neo4j from "neo4j-driver";

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

app.get("/api/getExercises", (req, res) => {
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
      RETURN ex SKIP ${offset} LIMIT 25`
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
