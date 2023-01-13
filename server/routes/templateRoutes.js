const express = require("express");
const router = express.Router();
const templateController = require("../controllers/templateController");

router
  .route("/")
  .get(templateController.getTemplateExercises)
  .post(templateController.createTemplate)
  .put(templateController.updateTemplate)
  .delete(templateController.deleteTemplate);

router.route("/folders").post(templateController.getTemplateFolders);
router.route("/folders/templates").post(templateController.getFolderTemplates);

router
  .route("/folder")
  .post(templateController.createTemplateFolder)
  .delete(templateController.deleteTemplateFolder)
  .put(templateController.updateTemplateFolder);

router.route("/folder/template").get(templateController.getTemplateExercises);

module.exports = router;
