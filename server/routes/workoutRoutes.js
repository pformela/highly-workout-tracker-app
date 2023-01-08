const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workoutControllers");

router.route("/").get(workoutController.getWorkouts);

module.exports = router;
