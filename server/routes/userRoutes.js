const express = require("express");
const router = express.Router();
const path = require("path");
const userController = require("../controllers/usersControllers");

router
  .route("/")
  .get(userController.getUser)
  .post(userController.createNewUser)
  .delete(userController.deleteUser);

router.route("/editUsername").patch(userController.updateUserUsername);

router.route("/editPassword").patch(userController.updateUserPassword);

router.route("/editEmail").patch(userController.updateUserEmail);

module.exports = router;
