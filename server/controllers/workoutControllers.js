const asyncHandler = require("express-async-handler");
const { getDownloadURL } = require("firebase/storage");
const neo4j = require("neo4j-driver");
const { v4: uuidv4 } = require("uuid");
const ref = require("firebase/storage").ref;
const uploadBytes = require("firebase/storage").uploadBytes;
const storage = require("../firebase");
const multer = require("multer");
const upload = multer();

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
    MATCH (w)-[best_set:BEST_SET]->(ex)
    RETURN w, set, ex, best_set
    ORDER BY w.created_at DESC
    `
    )
    .then((result) => {
      const workouts = result.records.reduce((acc, record) => {
        const workoutId = record._fields[0].properties.workout_id;
        const imageUrl = record._fields[0].properties.image_url;
        const templateName = record._fields[0].properties.template_name;
        const exerciseId = record._fields[2].identity.low;
        const bestSetReps = record._fields[3].properties.reps.low;
        const bestSetWeight = record._fields[3].properties.weight.low;

        if (!(workoutId in acc)) {
          acc[workoutId] = {
            templateName,
            imageUrl,
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
                exerciseId: record._fields[2].identity.low,
                exerciseEquipment: record._fields[2].properties.equipment,
                exerciseInstructions: record._fields[2].properties.instructions,
                bestSet: {
                  reps: bestSetReps,
                  weight: bestSetWeight,
                },
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
            exerciseId: record._fields[2].identity.low,
            exerciseEquipment: record._fields[2].properties.equipment,
            exerciseInstructions: record._fields[2].properties.instructions,
            bestSet: {
              reps: bestSetReps,
              weight: bestSetWeight,
            },
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

  const imageUrl = "";

  // const imageRef = image ? ref(storage, `workoutImages/${workoutId}`) : null;
  // const imageUploadResult = image ? await uploadBytes(imageRef, image) : null;
  // const imageUrl = image ? await getDownloadURL(imageUploadResult.ref) : "";

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
      }, template_name: "${templateName}", workout_id: "${workoutId}", volume: ${workoutVolume}, created_at: datetime(), image_url: "${imageUrl}"})
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
      session.close();

      res.send({ workoutId });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error creating workout");
    });
});

const deleteWorkout = asyncHandler(async (req, res) => {
  const { workoutId } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
      MATCH (workout:Workout {workout_id: "${workoutId}"})
      DETACH DELETE workout
      RETURN workout
      `
    )
    .then((result) => {
      session.close();

      res.send({ workoutId });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error deleting workout");
    });
});

const getSingleWorkout = asyncHandler(async (req, res) => {
  const { username, workoutId } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
      MATCH (workout:Workout {workout_id: "${workoutId}"})-[set:COMMITED_SET_OF]->(exercise:Exercise)
      MATCH (workout)-[best_set:BEST_SET]->(exercise)
      RETURN workout, set, exercise, best_set
      `
    )
    .then((result) => {
      const workouts = result.records.reduce((acc, record) => {
        const workoutId = record._fields[0].properties.workout_id;
        const imageUrl = record._fields[0].properties.image_url;
        const templateName = record._fields[0].properties.template_name;
        const exerciseId = record._fields[2].identity.low;
        const bestSetReps = record._fields[3].properties.reps.low;
        const bestSetWeight = record._fields[3].properties.weight.low;

        if (!(workoutId in acc)) {
          acc[workoutId] = {
            templateName,
            imageUrl,
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
                exerciseId: record._fields[2].identity.low,
                exerciseEquipment: record._fields[2].properties.equipment,
                exerciseInstructions: record._fields[2].properties.instructions,
                bestSet: {
                  reps: bestSetReps,
                  weight: bestSetWeight,
                },
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
            exerciseId: record._fields[2].identity.low,
            exerciseEquipment: record._fields[2].properties.equipment,
            exerciseInstructions: record._fields[2].properties.instructions,
            bestSet: {
              reps: bestSetReps,
              weight: bestSetWeight,
            },
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

      res.send({ ...workouts[workoutId] });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).send("Error getting workout");
    });
});

module.exports = {
  getWorkoutHistory,
  createWorkout,
  deleteWorkout,
  getSingleWorkout,
};
