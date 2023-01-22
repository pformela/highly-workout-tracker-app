const asyncHandler = require("express-async-handler");
const neo4j = require("neo4j-driver");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_LOGIN, process.env.NEO4J_PASSWORD)
);

const getExercises = asyncHandler(async (req, res) => {
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
            ${
              name.trim().length > 0 ? `WHERE ex.name =~ '(?i).*${name}.*'` : ""
            } 
            RETURN ex, id(ex) AS exerciseId`
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
          ${name.trim().length > 0 ? `WHERE ex.name =~ '(?i).*${name}.*'` : ""} 
                RETURN count(ex) as count`
        )
        .then((countResult) => {
          if (exerciseResult.records.length === 0) {
            res.send({ result: [], count: 0 });
            return;
          }
          res.send({
            result: exerciseResult.records.map((r) => {
              return {
                ...r.get("ex").properties,
                labels: r.get("ex").labels,
                exerciseId: r._fields[1].low,
              };
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

const getNumberOfExercises = asyncHandler(async (req, res) => {
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

module.exports = {
  getExercises,
  getNumberOfExercises,
};
