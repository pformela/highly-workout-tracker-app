import React, { useState } from "react";
import { selectFolders } from "./folders/folderSlice";
import { useSelector } from "react-redux";
import { selectUsername } from "../user/userSlice";
import Folder from "./folders/Folder";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import CreateNewFolder from "./folders/CreateNewFolder";
import TemplateForm from "./templates/TemplateForm";
import { useCreateTemplateMutation } from "./templates/templateApiSlice";
import { useGetFolderTemplatesMutation } from "./folders/folderApiSlice";
import { Link } from "react-router-dom";

const WorkoutTemplates = ({ add }) => {
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(add);
  const templateFolders = useSelector(selectFolders);

  const [createTemplate] = useCreateTemplateMutation();
  const [getTemplates] = useGetFolderTemplatesMutation();

  const username = useSelector(selectUsername);

  const handleSubmit = async (
    e,
    exercises,
    templateName,
    folderId,
    selectedFolderName,
    validateExerciseInputs,
    setIsSubmitting,
    setTemplateNameIsValid,
    setFolderIdIsValid
  ) => {
    e.preventDefault();
    console.log("wysylam");
    const tempNameValid = templateName.trim().length > 2;
    const folderIdValid = folderId !== "Select folder";
    const exercisesIsValid = validateExerciseInputs();
    if (!tempNameValid) {
      setTemplateNameIsValid(false);
    }
    if (!folderIdValid) {
      setFolderIdIsValid(false);
    }
    if (tempNameValid && folderIdValid && exercisesIsValid) {
      console.log("Wszystko grA");
      const partiallyFinalExerciseList = JSON.parse(JSON.stringify(exercises));
      const finalExerciseList = partiallyFinalExerciseList.map((el) => {
        delete el["nameIsValid"];
        delete el["setsIsValid"];
        delete el["repsIsValid"];
        delete el["weightIsValid"];
        return el;
      });

      try {
        const { name } = await createTemplate({
          username,
          folderId,
          name: templateName,
          exercises: finalExerciseList,
        }).unwrap();

        console.log("Created template: " + name);
        setShowCreateTemplate(false);
      } catch (err) {
        console.log(err);
      }

      try {
        await getTemplates({
          username,
          folderName: selectedFolderName,
          folderId,
        }).unwrap();
        console.log(
          "Updated list of templates for folder: " + selectedFolderName
        );
      } catch (err) {
        console.log(err);
      }

      console.log(finalExerciseList);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="w-3/4 m-auto mt-6 flex flex-col gap-3">
        <div className="flex flex-row justify-between border-solid border-b-2 mb-2 border-darkGray">
          <h2 className="text-silver text-3xl p-4">Templates</h2>
          <div className="flex flex-row gap-2">
            <Link to="/addTemplate" className="self-center">
              <Button
                className="text-center bg-darkNavy self-center"
                onClick={() => setShowCreateTemplate(true)}
              >
                New template
              </Button>
            </Link>
            <Button
              className="text-center bg-darkNavy self-center"
              onClick={() => setShowAddFolder(true)}
            >
              New folder
            </Button>
          </div>
        </div>
        {templateFolders.map((folder) => (
          <Folder key={folder.folderId} folder={folder} />
        ))}
      </div>
      {showAddFolder && (
        <Modal>
          <CreateNewFolder onClose={() => setShowAddFolder(false)} />
        </Modal>
      )}
      {showCreateTemplate && (
        <Modal>
          <TemplateForm
            modalName="Create new template"
            formTemplateName=""
            formFolderId="Select folder"
            type="Create"
            onClose={() => setShowCreateTemplate(false)}
            onSubmit={handleSubmit}
            formExercises={[]}
          />
        </Modal>
      )}
    </>
  );
};

export default WorkoutTemplates;
