const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutControllers");

router
  .route("/")
  .post(workoutController.createWorkout)
  .delete(workoutController.deleteWorkout);

router.route("/history").post(workoutController.getWorkoutHistory);

router.route("/single").post(workoutController.getSingleWorkout);

module.exports = router;
