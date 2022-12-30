const express = require("express");
const router = express.Router();
const path = require("path");
const userController = require("../controllers/usersControllers");

router
  .route("/")
  .get(usersController.getUser())
  .post(usersController.createNewUser())
  .patch(usersController.updateUser())
  .delete(usersController.deleteUser());

module.exports = router;
