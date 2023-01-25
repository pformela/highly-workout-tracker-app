const express = require("express");
const router = express.Router();
const exerciseController = require("../controllers/exerciseControllers");

router
  .route("/")
  .get(exerciseController.getExercises)
  .post(exerciseController.createExercise)
  .put(exerciseController.updateExercise)
  .delete(exerciseController.deleteExercise);

router.route("/number").get(exerciseController.getNumberOfExercises);

module.exports = router;
