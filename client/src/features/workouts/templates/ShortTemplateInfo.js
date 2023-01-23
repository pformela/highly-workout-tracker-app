import React, { useState } from "react";
import Modal from "../../../components/UI/Modal";
import TemplateForm from "./TemplateForm";
import { useSelector } from "react-redux";
import { selectUsername } from "../../user/userSlice";
import { useUpdateTemplateMutation } from "./templateApiSlice";
import DeleteTemplate from "./DeleteTemplate";
import TemplateInfo from "./TemplateInfo";
import { useNavigate } from "react-router-dom";

const ShortTemplateInfo = ({ template, templateId, folderId, update }) => {
  const [showUpdateModal, setShowUpdateModal] = useState(update);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const exerciseContent = template.exercises.reduce((acc, exercise, index) => {
    if (index === 0) {
      return acc + " " + exercise.exerciseName;
    } else if (index < template.exercises.length - 1 && index !== 0) {
      return acc + ", " + exercise.exerciseName;
    } else {
      return acc + " and " + exercise.exerciseName + ".";
    }
  }, "");

  const dropdownContent = (
    <div className="">
      <select
        className="bg-navy rounded-md px-2 py-1 text-gray active:text-white"
        onChange={(e) => {
          if (e.target.value === "Start Workout") {
            navigate(`/${folderId}/${templateId}`);
          } else if (e.target.value === "Show more info") {
            setShowMoreInfoModal(true);
          } else if (e.target.value === "Update template") {
            setShowUpdateModal(true);
          } else if (e.target.value === "Delete template") {
            setShowDeleteModal(true);
          }
        }}
      >
        <option isdisabled="true">Select an action</option>
        <option>Start Workout</option>
        <option>Show more info</option>
        <option>Update template</option>
        <option>Delete template</option>
      </select>
    </div>
  );

  const [updateTemplate] = useUpdateTemplateMutation();

  const username = useSelector(selectUsername);

  const handleUpdate = async (
    e,
    exercises,
    templateName,
    formFolderId,
    selectedFolderName,
    validateExerciseInputs,
    setIsSubmitting,
    setTemplateNameIsValid,
    setFolderIdIsValid
  ) => {
    e.preventDefault();
    console.log("wysylam");
    const tempNameValid = templateName.trim().length > 2;
    const folderIdValid = formFolderId !== "Select folder";
    const exercisesIsValid = validateExerciseInputs();
    if (!tempNameValid) {
      setTemplateNameIsValid(false);
    }
    if (!folderIdValid) {
      setFolderIdIsValid(false);
    }
    if (tempNameValid && folderIdValid && exercisesIsValid) {
      const partiallyFinalExerciseList = JSON.parse(JSON.stringify(exercises));
      const finalExerciseList = partiallyFinalExerciseList.map((el) => {
        delete el["nameIsValid"];
        delete el["setsIsValid"];
        delete el["repsIsValid"];
        delete el["weightIsValid"];
        return el;
      });

      try {
        await updateTemplate({
          username,
          templateId,
          folderId: formFolderId,
          name: templateName,
          exercises: finalExerciseList,
        }).unwrap();

        setShowUpdateModal(false);
      } catch (err) {
        console.log(err);
      }

      console.log(finalExerciseList);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className="flex flex-col bg-darkNavy border-4 border-darkNavy rounded-xl w-60 h-64 justify-between">
        <div className="flex-col w-full self-start">
          <h1 className="text-white text-xl font-bold bg-darkNavy py-4 border-b-2 mx-4">
            {template.name}
          </h1>
          <div className="p-4 pb-0 text-white">
            {exerciseContent.length > 90
              ? exerciseContent.slice(0, 90) + "..."
              : exerciseContent}
          </div>
        </div>
        <div className="relative flex flex-row p-4 self-center">
          {dropdownContent}
        </div>
      </div>
      {showMoreInfoModal && (
        <Modal>
          <TemplateInfo
            template={template}
            templateId={templateId}
            onClose={() => {
              setShowMoreInfoModal(false);
            }}
          />
        </Modal>
      )}
      {showDeleteModal && (
        <Modal>
          <DeleteTemplate
            folderId={folderId}
            templateId={templateId}
            templateName={template.name}
            onClose={() => setShowDeleteModal(false)}
          />
        </Modal>
      )}
      {showUpdateModal && (
        <Modal>
          <TemplateForm
            modalName={`Update template ${template.name}`}
            type="Update"
            formFolderId={folderId}
            formTemplateName={template.name}
            formExercises={JSON.parse(JSON.stringify(template.exercises))}
            onClose={() => setShowUpdateModal(false)}
            onSubmit={handleUpdate}
          />
        </Modal>
      )}
    </>
  );
};

export default ShortTemplateInfo;
