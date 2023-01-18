const asyncHandler = require("express-async-handler");
const neo4j = require("neo4j-driver");
const { v4: uuidv4 } = require("uuid");

const driver = neo4j.driver(
  process.env.NEO4J_URI,
  neo4j.auth.basic(process.env.NEO4J_LOGIN, process.env.NEO4J_PASSWORD)
);

const getWorkoutHistory = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (u:User {username: "${username}"})-[:COMMITED_WORKOUT]->(w:Workout)
    MATCH (w)-[set:COMMITED_SET_OF]->(ex:Exercise)
    RETURN w, set, ex
    ORDER BY w.created_at DESC
    `
    )
    .then((result) => {
      const workouts = result.records.reduce((acc, record) => {
        const workoutId = record._fields[0].properties.workout_id;
        const exerciseId = record._fields[2].identity.low;

        if (!(workoutId in acc)) {
          acc[workoutId] = {
            duration: {
              hours: record._fields[0].properties.hours.low,
              minutes: record._fields[0].properties.minutes.low,
              seconds: record._fields[0].properties.seconds.low,
            },
            volume: record._fields[0].properties.volume.low,
            date: record._fields[0].properties.created_at.toString(),
            exercises: {
              [exerciseId]: {
                exerciseName: record._fields[2].properties.name,
                sets: [
                  {
                    reps: record._fields[1].properties.reps.low,
                    weight: record._fields[1].properties.weight.low,
                  },
                ],
              },
            },
          };
        } else if (
          workoutId in acc &&
          !(exerciseId in acc[workoutId].exercises)
        ) {
          acc[workoutId].exercises[exerciseId] = {
            exerciseName: record._fields[2].properties.name,
            sets: [
              {
                reps: record._fields[1].properties.reps.low,
                weight: record._fields[1].properties.weight.low,
              },
            ],
          };
        } else {
          acc[workoutId].exercises[exerciseId].sets.push({
            reps: record._fields[1].properties.reps.low,
            weight: record._fields[1].properties.weight.low,
          });
        }

        return acc;
      }, {});

      session.close();

      res.send(workouts);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error getting workouts");
    });
});

const createWorkout = asyncHandler(async (req, res) => {
  const { username, duration, exercises, templateName, userWeight } = req.body;

  const workoutId = uuidv4();

  const workoutVolume = exercises.reduce((acc, exercise) => {
    return (
      acc +
      exercise.sets.reduce((acc, set) => {
        if (exercise.equipment === "body_only")
          return acc + set.reps * (userWeight + set.weight);
        else return acc + set.weight * set.reps;
      }, 0)
    );
  }, 0);

  const bestSets = [...exercises].reduce((acc, exercise) => {
    const bestSet = exercise.sets.reduce(
      (acc, set) => {
        if (set.weight > acc.weight) {
          return set;
        } else {
          return acc;
        }
      },
      { weight: 0, reps: 0 }
    );
    return { ...acc, [exercise.exerciseId]: bestSet };
  }, {});

  console.log(bestSets);

  const session = driver.session();
  const result = await session
    .run(
      `
      MATCH (user:User {username: "${username}"})
      ${exercises.reduce((acc, exercise) => {
        return (
          acc +
          `
          MATCH (ex${exercise.exerciseId}:Exercise {name: "${exercise.exerciseName}"})\n
          WHERE ID(ex${exercise.exerciseId}) = ${exercise.exerciseId}\n
          `
        );
      }, "")}
      ${exercises.reduce((acc, exercise) => {
        return (
          acc +
          `
            MERGE (user)-[best_set${exercise.exerciseId}:BEST_SET_OF]->(ex${
            exercise.exerciseId
          })\n
            SET best_set${exercise.exerciseId}.reps = CASE WHEN best_set${
            exercise.exerciseId
          }.reps IS NULL THEN ${bestSets[exercise.exerciseId].reps}
            WHEN ${bestSets[exercise.exerciseId].reps} > best_set${
            exercise.exerciseId
          }.reps THEN ${bestSets[exercise.exerciseId].reps} 
            ELSE best_set${exercise.exerciseId}.reps END
            SET best_set${exercise.exerciseId}.weight = CASE WHEN best_set${
            exercise.exerciseId
          }.weight IS NULL THEN ${bestSets[exercise.exerciseId].weight}
            WHEN ${bestSets[exercise.exerciseId].weight} > best_set${
            exercise.exerciseId
          }.weight THEN ${bestSets[exercise.exerciseId].weight} 
            ELSE best_set${exercise.exerciseId}.weight END
          `
        );
      }, "")}
      CREATE (user)-[workout_rel:COMMITED_WORKOUT]->(workout:Workout {hours: ${
        duration.hours
      }, minutes: ${duration.minutes}, seconds: ${
        duration.seconds
      }, template_name: "${templateName}", workout_id: "${workoutId}", volume: ${workoutVolume}, created_at: datetime()})
      ${exercises.reduce((accEx, exercise) => {
        return (
          accEx +
          `MERGE (workout)-[best_set_exercise${
            exercise.exerciseId
          }:BEST_SET]->(ex${exercise.exerciseId})\n
          SET best_set_exercise${exercise.exerciseId}.reps = ${
            bestSets[exercise.exerciseId].reps
          }
          SET best_set_exercise${exercise.exerciseId}.weight = ${
            bestSets[exercise.exerciseId].weight
          }
          ` +
          exercise.sets.reduce((accSets, set, index) => {
            return (
              accSets +
              `
            CREATE (workout)-[:COMMITED_SET_OF{reps: ${set.reps}, weight: ${set.weight}, created_at: datetime()}]->(ex${exercise.exerciseId})\n
            `
            );
          }, "")
        );
      }, "")}
      RETURN workout
      `
    )
    .then((result) => {
      console.log(result);
      const workouts = result.records.map((workout) => {
        return workout._fields[0].properties;
      });

      session.close();

      res.send(workouts);
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error creating workout");
    });
});

module.exports = {
  getWorkoutHistory,
  createWorkout,
};
