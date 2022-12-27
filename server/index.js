import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import neo4j from "neo4j-driver";
import axios from "axios";

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
    .then((result) => {
      res.send(result.records.map((r) => r.get("ex")));
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      session.close();
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
    .then((result) => {
      res.send(result.records);
    })
    .catch((error) => {
      console.log(error);
    })
    .then(() => {
      session.close();
    });
});
