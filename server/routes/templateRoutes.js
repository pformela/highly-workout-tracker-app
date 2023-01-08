const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");

router
  .route("/")
  .get(templateController.getTemplateFolders)
  .post(templateController.createTemplateFolder);

router.route("/getFolders").post(templateController.getTemplateFolders);

router
  .route("/folder")
  .get(templateController.getFolderTemplates)
  .post(templateController.createTemplate);

router.route("/folder/template").get(templateController.getTemplateExercises);

module.exports = router;
