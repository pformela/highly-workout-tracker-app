const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutControllers");

router.route("/").post(workoutController.createWorkout);

router.route("/history").post(workoutController.getWorkoutHistory);

module.exports = router;
