import React, { useState } from "react";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import TemplateForm from "./TemplateForm";
import { useSelector } from "react-redux";
import { selectUsername } from "../../user/userSlice";
import { useUpdateTemplateMutation } from "./templateApiSlice";
import { useGetFolderTemplatesMutation } from "../folders/folderApiSlice";
import DeleteTemplate from "./DeleteTemplate";
import TemplateInfo from "./TemplateInfo";
import { useNavigate } from "react-router-dom";

const ShortTemplateInfo = ({ template, templateId, folderId }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  const re = new RegExp(
    `.*dropdown.*|.*dropdownCollapseButton.*|.*dropdownButton.*`
  );

  document.addEventListener("click", (e) => {
    try {
      if (!e.target.className.match(re)) {
        setShowDropdown(false);
      }
    } catch (err) {
      console.log(err);
    }
  });

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
    <div
      id="dropdown"
      className="dropdown absolute bottom-16 z-10 bg-white divide-y divide-gray-100 rounded-xl shadow w-40 bg-white border-2 border-white"
    >
      <ul
        className="flex flex-col py-1 text-sm dark:text-gray-200"
        aria-labelledby="dropdownDefaultButton"
      >
        <Button
          className="dropdownButton block px-4 py-2 font-bold text-darkNavy hover:bg-darkNavy hover:text-white"
          onClick={() => {
            setShowDropdown(false);
            navigate(`/user/startWorkout/${folderId}/${templateId}`);
          }}
        >
          Start Workout
        </Button>
        <Button
          className="dropdownButton block px-4 py-2 font-bold text-darkNavy hover:bg-darkNavy hover:text-white"
          onClick={() => {
            setShowDropdown(false);
            setShowMoreInfoModal(true);
          }}
        >
          Show more info
        </Button>
        <Button
          className="dropdownButton block px-4 py-2 font-bold text-darkNavy hover:bg-darkNavy hover:text-white"
          onClick={() => {
            setShowDropdown(false);
            setShowUpdateModal(true);
          }}
        >
          Update template
        </Button>
        <Button
          className="dropdownButton block px-4 py-2 font-bold text-darkNavy hover:bg-darkNavy hover:text-white"
          onClick={() => {
            setShowDropdown(false);
            setShowDeleteModal(true);
          }}
        >
          Delete template
        </Button>
      </ul>
    </div>
  );

  const [updateTemplate, { isLoading }] = useUpdateTemplateMutation();
  const [getTemplates, { isLoading: isLoadingTemplates }] =
    useGetFolderTemplatesMutation();

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
        const { name } = await updateTemplate({
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
        <div className="relative flex flex-row self-end p-4">
          <Button
            id="dropdownCollapseButton"
            className="dropdownCollapseButton border-2 border-white hover:bg-white hover:text-darkNavy"
            onClick={() => setShowDropdown((prev) => !prev)}
          >
            ●●●
          </Button>
          {showDropdown && dropdownContent}
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
