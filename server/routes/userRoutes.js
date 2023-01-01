const express = require("express");
const router = express.Router();
const path = require("path");
const userController = require("../controllers/usersControllers");

router
  .route("/")
  .get(usersController.getUser())
  .post(usersController.createNewUser())
  .delete(usersController.deleteUser());

router.route("/editUsername").patch(usersController.editUsername());

router.route("/editPassword").patch(usersController.editPassword());

router.route("/editEmail").patch(usersController.editEmail());

module.exports = router;
