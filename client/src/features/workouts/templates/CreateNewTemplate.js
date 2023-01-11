import React, { useState } from "react";
import Button from "../../../components/UI/Button";
import { Field, Formik } from "formik";
import { selectFolders } from "../folders/folderSlice";
import { useSelector } from "react-redux";

const CreateNewTemplate = ({ onClose }) => {
  const [exercises, setExercises] = useState([]);
  const folders = useSelector(selectFolders);

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

  const handleExerciseChange = (e, index, type) => {
    const newExercises = [...exercises];
    if (type === "sets" || type === "reps" || type === "weight") {
      if (e.target.value <= 1) {
        newExercises[index][`${type}IsValid`] = false;
      } else {
        newExercises[index][`${type}IsValid`] = true;
      }
    }
    newExercises[index][type] = e.target.value;
    setExercises(newExercises);
  };

  const handleRemoveExercises = (index) => {
    const newExercises = [
      ...exercises.slice(0, index),
      ...exercises.slice(index + 1),
    ];
    setExercises(newExercises);
  };

  return (
    <div className="flex flex-col gap-4">
      <Formik
        initialValues={{
          folderId: "",
          templateName: "",
          exercises: exercises,
        }}
        enableReinitialize
        validate={(values) => {
          const errors = {};
          if (!values.folderId) errors.folder = "Folder is required";
          if (!values.templateName) errors.templateName = "Name is required";

          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(false);
        }}
      >
        {({ values, handleChange, handleSubmit, isSubmitting, errors }) => (
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 justify-center w-min mx-auto p-4"
          >
            <div className="flex flex-col gap-4 pb-4 border-b-4 border-darkNavy">
              <h1 className="text-silver self-center text-center font-bold text-4xl mb-6">
                Create new template
              </h1>
              <select
                className="bg-darkNavy text-silver p-4 text-xl rounded-xl"
                name="folder"
                onChange={handleChange}
              >
                {folders.map((folder) => (
                  <option key={folder.folderId} value={folder.folderId}>
                    {folder.name}
                  </option>
                ))}
              </select>
              <input
                className={`bg-darkNavy p-4 text-white text-center rounded-xl text-2xl border-2 ${
                  errors.templateName ? "border-red-500" : "border-darkNavy"
                }`}
                type="text"
                name="templateName"
                placeholder="Template name"
                onChange={handleChange}
                value={values.templateName}
              />
            </div>
            {exercises.map((exercise, index) => {
              return (
                <div key={index} className="flex flex-row gap-2">
                  <Field
                    className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
                    type="text"
                    name={`exercises[${index}].exerciseName`}
                    placeholder="Exercise name"
                    onChange={(e) =>
                      handleExerciseChange(e, index, "exerciseName")
                    }
                    value={exercises[index].exerciseName}
                  />
                  <div className="flex flex-row gap-2">
                    <Field
                      className={`bg-darkNavy p-2 text-white rounded-xl w-32 text-xl border-2 ${
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
                    <Field
                      className={`bg-darkNavy p-2 text-white rounded-xl w-32 text-xl border-2 ${
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
                    <Field
                      className={`bg-darkNavy p-2 text-white rounded-xl w-32 text-xl border-2 ${
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

            <Button
              className="m-4 bg-blue-500 text-xl font-bold hover:bg-silver hover:text-darkNavy"
              onClick={handleAddExercise}
              type="button"
            >
              Add Exercise
            </Button>
            {/* <Button
              className="m-4 bg-blue-500 text-xl font-bold hover:bg-silver hover:text-darkNavy"
              onClick={showInputs}
              type="button"
            >
              Show inputs
            </Button> */}
            <div className="flex flex-row gap-2 justify-center">
              <Button
                className="bg-green-500 w-min text-white font-bold rounded-md text-xl self-center hover:bg-silver hover:text-darkNavy"
                type="submit"
                disabled={isSubmitting}
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
        )}
      </Formik>
    </div>
  );
};

export default CreateNewTemplate;
