import React, { useState } from "react";
import Button from "../../../components/UI/Button";
import { selectFolders } from "../folders/folderSlice";
import { selectUsername } from "../../user/userSlice";
import { useSelector } from "react-redux";
import ExerciseSearchForm from "../../exercises/ExerciseSearchForm";
import FoundExercises from "../../exercises/FoundExercises";
import { TYPES, MUSCLE, DIFFICULTY } from "../../exercises/Exercises";
import { useCreateTemplateMutation } from "./templateApiSlice";
import "./Scrollbar.css";

const CreateNewTemplate = ({ onClose }) => {
  const [templateName, setTemplateName] = useState("");
  const [templateNameIsValid, setTemplateNameIsValid] = useState(true);
  const [folderId, setFolderId] = useState("Select folder");
  const [folderIdIsValid, setFolderIdIsValid] = useState(true);
  const [exercises, setExercises] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPickExercise, setShowPickExercise] = useState(false);
  const [formExerciseIndex, setFormExerciseIndex] = useState(0);

  const folders = useSelector(selectFolders);
  const username = useSelector(selectUsername);

  const [createTemplate, { isLoading }] = useCreateTemplateMutation();

  const handleTemplateNameChange = (e) => {
    if (e.target.value.trim().length > 2) {
      setTemplateNameIsValid(true);
    } else {
      setTemplateNameIsValid(false);
    }
    setTemplateName(e.target.value);
  };

  const handleFolderIdChange = (e) => {
    console.log("folder: " + e.target.value);
    if (e.target.value === "Select folder") {
      setFolderIdIsValid(false);
    } else {
      setFolderIdIsValid(true);
    }
    setFolderId(e.target.value);
  };

  const handleSelectExercise = (exerciseName, exerciseId) => {
    console.log("exerciseName: " + exerciseName);
    console.log("exerciseId: " + exerciseId);
    const newExercises = [...exercises];
    newExercises[formExerciseIndex].exerciseId = exerciseId;
    newExercises[formExerciseIndex].exerciseName = exerciseName;
    newExercises[formExerciseIndex].nameIsValid = true;
    setExercises(newExercises);
    setShowPickExercise(false);
  };

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        exerciseName: "",
        exerciseId: "",
        sets: "",
        reps: "",
        weight: "",
        nameIsValid: true,
        setsIsValid: true,
        repsIsValid: true,
        weightIsValid: true,
      },
    ]);
  };

  const showInputs = () => {
    console.log(exercises);
  };

  const areExerciseInputsValid = () => {
    console.log("validating exercises...");
    const validatedExercises = [...exercises];
    validatedExercises.map((exercise) => {
      if (exercise.exerciseName.trim() === "") {
        exercise.nameIsValid = false;
        console.log("name is invalid");
      }
      if (exercise.sets < 1) {
        exercise.setsIsValid = false;
        console.log("sets is invalid");
      }
      if (exercise.reps < 1) {
        exercise.repsIsValid = false;
        console.log("reps is invalid");
      }
      if (exercise.weight < 0) {
        exercise.weightIsValid = false;
        console.log("weight is invalid");
      }
    });

    const finalResult = validatedExercises.reduce((acc, curr) => {
      const partialResult =
        curr.setsIsValid &&
        curr.repsIsValid &&
        curr.weightIsValid &&
        curr.nameIsValid;
      return acc && partialResult;
    }, true);

    setExercises(validatedExercises);

    return finalResult;
  };

  const handleExerciseChange = (e, index, type) => {
    const newExercises = [...exercises];
    if (type === "sets" || type === "reps") {
      if (e.target.value < 1) {
        newExercises[index][`${type}IsValid`] = false;
      } else {
        newExercises[index][`${type}IsValid`] = true;
      }
    } else if (type === "weight") {
      if (e.target.value < 0) {
        newExercises[index][`${type}IsValid`] = false;
      } else {
        newExercises[index][`${type}IsValid`] = true;
      }
    }
    newExercises[index][type] = Number(e.target.value);
    setExercises(newExercises);
  };

  const handleRemoveExercises = (index) => {
    const newExercises = [
      ...exercises.slice(0, index),
      ...exercises.slice(index + 1),
    ];
    if (newExercises.length === 0) {
      setShowPickExercise(false);
    }
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("wysylam");
    const tempNameValid = templateName.trim().length > 2;
    const folderIdValid = folderId !== "Select folder";
    const exercisesIsValid = areExerciseInputsValid();
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
        onClose();
      } catch (err) {
        console.log(err);
      }

      console.log(finalExerciseList);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col gap-4 max-w-min">
      <div className="flex flex-row">
        {showPickExercise && (
          <div className="flex flex-col">
            <h1 className="text-silver self-center text-center font-bold text-4xl mb-4">
              Pick an exercise
            </h1>
            <div className="pr-4 border-r-2 border-darkNavy">
              <ExerciseSearchForm
                types={TYPES}
                muscle={MUSCLE}
                difficulty={DIFFICULTY}
              />
              <FoundExercises pick={true} onSelect={handleSelectExercise} />
            </div>
          </div>
        )}
        <form className="flex flex-col gap-4 justify-center w-min mx-auto p-4">
          <div className="flex flex-col gap-4 pb-4 border-b-4 border-darkNavy">
            <h1 className="text-silver self-center text-center font-bold text-4xl mb-6">
              Create new template
            </h1>
            <select
              className={`bg-darkNavy text-silver p-4 text-xl rounded-xl border-2 ${
                !folderIdIsValid ? "border-red-500" : "border-darkNavy"
              }`}
              name="folder"
              onChange={handleFolderIdChange}
            >
              <option value="Select folder">Select folder</option>
              {folders.map((folder) => (
                <option key={folder.folderId} value={folder.folderId}>
                  {folder.name}
                </option>
              ))}
            </select>
            <input
              className={`bg-darkNavy p-4 text-white text-center rounded-xl text-2xl border-2 ${
                !templateNameIsValid ? "border-red-500" : "border-darkNavy"
              }`}
              type="text"
              name="templateName"
              placeholder="Template name"
              onChange={handleTemplateNameChange}
              value={templateName}
            />
          </div>
          <div className="flex flex-col scrollbar p-4 gap-4 overflow-auto max-h-80">
            {exercises.length > 0 && (
              <div className="flex flex-row gap-2 justify-between">
                <h1 className="text-silver self-center text-xl w-full p-2">
                  Exercises
                </h1>
                <div className="flex flex-row gap-2">
                  <h1 className="text-silver self-center text-xl w-28 p-2">
                    Sets
                  </h1>
                  <h1 className="text-silver self-center text-xl w-28 p-2">
                    Reps
                  </h1>
                  <h1 className="text-silver self-center text-xl w-28  p-2">
                    Weight
                  </h1>
                </div>
                <span className="w-2/6"></span>
              </div>
            )}
            {exercises.map((exercise, index) => {
              return (
                <div
                  key={index}
                  className="flex flex-row gap-2 justify-between"
                >
                  <input
                    className={`bg-darkNavy p-2 text-white rounded-xl w-min text-xl border-2 ${
                      exercises[index].nameIsValid
                        ? "border-darkNavy"
                        : "border-red-500"
                    }`}
                    type="text"
                    name={`exercises[${index}].exerciseName`}
                    placeholder="Exercise name"
                    onClick={() => {
                      setShowPickExercise(true);
                      setFormExerciseIndex(index);
                    }}
                    onChange={() => {}}
                    value={exercises[index].exerciseName}
                  />
                  <div className="flex flex-row gap-2">
                    <input
                      className={`bg-darkNavy p-2 text-white rounded-xl w-28 text-xl border-2 ${
                        exercises[index].setsIsValid
                          ? "border-darkNavy"
                          : "border-red-500"
                      }`}
                      type="number"
                      name={`exercises[${index}].sets`}
                      placeholder="Sets"
                      onChange={(e) => handleExerciseChange(e, index, "sets")}
                      value={exercises[index].sets}
                    />
                    <input
                      className={`bg-darkNavy p-2 text-white rounded-xl w-28 text-xl border-2 ${
                        exercises[index].repsIsValid
                          ? "border-darkNavy"
                          : "border-red-500"
                      }`}
                      type="number"
                      name={`exercises[${index}].reps`}
                      placeholder="Reps"
                      onChange={(e) => handleExerciseChange(e, index, "reps")}
                      value={exercises[index].reps}
                    />
                    <input
                      className={`bg-darkNavy p-2 text-white rounded-xl w-28 text-xl border-2 ${
                        exercises[index].weightIsValid
                          ? "border-darkNavy"
                          : "border-red-500"
                      }`}
                      type="number"
                      name={`exercises[${index}].weight`}
                      placeholder="Weight"
                      onChange={(e) => handleExerciseChange(e, index, "weight")}
                      value={exercises[index].weight}
                    />
                  </div>
                  <Button
                    className="text-xl font-bold bg-blue-500 self-center rounded-md text-center h-10"
                    onClick={() => handleRemoveExercises(index)}
                    type="button"
                  >
                    Remove
                  </Button>
                </div>
              );
            })}
          </div>
          <Button
            className="m-4 bg-blue-500 text-xl font-bold hover:bg-silver hover:text-darkNavy"
            onClick={handleAddExercise}
            type="button"
          >
            Add Exercise
          </Button>
          <Button
            className="m-4 bg-blue-500 text-xl font-bold hover:bg-silver hover:text-darkNavy"
            onClick={showInputs}
            type="button"
          >
            Show inputs
          </Button>
          <div className="flex flex-row gap-2 justify-center">
            <Button
              className="bg-green-500 w-min text-white font-bold rounded-md text-xl self-center hover:bg-silver hover:text-darkNavy"
              type="submit"
              onClick={handleSubmit}
            >
              Create
            </Button>
            <Button
              className="flex self-center bg-red-500 text-xl font-bold hover:bg-silver hover:text-darkNavy"
              onClick={onClose}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewTemplate;
