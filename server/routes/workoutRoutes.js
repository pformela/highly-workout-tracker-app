const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutControllers");

const storage = require("../firebase");
const ref = require("firebase/storage");

router
  .route("/")
  .post(workoutController.createWorkout)
  .delete(workoutController.deleteWorkout)
  .put(workoutController.updateWorkout);

router.route("/history").post(workoutController.getWorkoutHistory);

router.route("/single").post(workoutController.getSingleWorkout);

module.exports = router;
