const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");

router
  .route("/")
  .get(templateController.getTemplateFolders)
  .post(templateController.createTemplateFolder);

router.route("/folders").post(templateController.getTemplateFolders);
router.route("/folders/templates").post(templateController.getFolderTemplates);

router
  .route("/folder")
  .post(templateController.createTemplate)
  .delete(templateController.deleteTemplateFolder)
  .put(templateController.updateTemplateFolder);

router.route("/folder/template").get(templateController.getTemplateExercises);

module.exports = router;
