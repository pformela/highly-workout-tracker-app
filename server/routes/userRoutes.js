const express = require("express");
const router = express.Router();
const path = require("path");
const userController = require("../controllers/usersControllers");

router
  .route("/")
  .get(userController.getUser())
  .post(userController.createNewUser())
  .delete(userController.deleteUser());

router.route("/editUsername").patch(userController.editUsername());

router.route("/editPassword").patch(userController.editPassword());

router.route("/editEmail").patch(userController.editEmail());

module.exports = router;
