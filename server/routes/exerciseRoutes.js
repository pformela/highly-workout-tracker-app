const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseControllers");

router.route("/").get(exerciseController.getExercises);

router.route("/number").get(exerciseController.getNumberOfExercises);

module.exports = router;
