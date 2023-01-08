const asyncHandler = require("express-async-handler");

const getWorkouts = asyncHandler(async (req, res) => {
  const { username } = req.body;

  const session = driver.session();
  const result = await session
    .run(
      `
    MATCH (wl:Workouts {name: "${username}"})<-[:BELONGS_TO]-(w:Workout)
    RETURN w
    `
    )
    .then((result) => {
      const workouts = result.records.map((workout) => {
        return workout._fields[0].properties;
      });

      session.close();

      res.send(workouts);
    })
    .catch((error) => {
      res.status(400).send("Error getting workouts");
    });
});

module.exports = {
  getWorkouts,
};
