import React from "react";
import NavBar from "../../components/NavBar";
import { Formik } from "formik";
import { TYPES, DIFFICULTY, MUSCLE, EQUIPMENT } from "./Exercises";
import {
  useCreateExerciseMutation,
  useUpdateExerciseMutation,
} from "./exerciseApiSlice";
import { useNavigate } from "react-router-dom";
import { selectCurrentUpdateExercise } from "./exercisesSlice";
import { useSelector } from "react-redux";

const ExerciseForm = ({ update }) => {
  const [createExercise] = useCreateExerciseMutation();
  const [updateExercise] = useUpdateExerciseMutation();

  const currentUpdateExercise = useSelector(selectCurrentUpdateExercise);
  const navigate = useNavigate();

  if (update && !currentUpdateExercise)
    return (
      <div className="bg-navy min-h-screen">
        <NavBar />
        <h1 className="text-red-500 text-4xl text-center mt-6">
          Error updating exercise
        </h1>
      </div>
    );

  const handleCreateExercise = async (values) => {
    try {
      await createExercise(values);
    } catch (err) {
      console.log(err);
    }
  };

  const handleUpdateExercise = async (values) => {
    try {
      await updateExercise({
        ...values,
        exerciseId: currentUpdateExercise.exerciseId,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="bg-navy min-h-screen">
      <NavBar />
      {!update ? (
        <h1 className="text-white text-4xl text-center mt-6">
          Create your own exercise
        </h1>
      ) : (
        <h1 className="text-white text-4xl text-center mt-6">
          Update your exercise
        </h1>
      )}
      <Formik
        initialValues={{
          name: update ? currentUpdateExercise.name : "",
          muscle: "",
          difficulty: "",
          type: "",
          instructions: update ? currentUpdateExercise.instructions : "",
          equipment: update ? currentUpdateExercise.equipment : "",
        }}
        validate={(values) => {
          const errors = {};
          if (!values.name) {
            errors.name = "Name is required";
          }
          if (
            (!update && !values.muscle) ||
            values.muscle === "Choose target muscle"
          ) {
            errors.muscle = "Muscle is required";
          }
          if (
            (!update && !values.type) ||
            values.type === "Choose exercise type"
          ) {
            errors.type = "Exercise type is required";
          }
          if (
            (!update && !values.difficulty) ||
            values.difficulty === "Choose difficulty"
          ) {
            errors.difficulty = "Difficulty is required";
          }
          if (!values.equipment || values.equipment === "Choose equipment") {
            errors.equipment = "Equipment is required";
          }
          return errors;
        }}
        onSubmit={(values) => {
          if (!update) {
            handleCreateExercise(values);
          } else {
            handleUpdateExercise(values);
          }
          navigate("/exercises");
        }}
      >
        {({ values, handleChange, handleSubmit, errors }) => (
          <form
            onSubmit={handleSubmit}
            className="p-6 mx-auto w-96 flex flex-col justify-center items-center gap-2 border-b-2 border-gray border-opacity-50"
          >
            {errors.name && (
              <span className="text-center text-red-500">{errors.name}</span>
            )}
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="Exercise name"
              className="p-2 rounded-lg bg-darkNavy text-silver active:outline-none focus:outline-none w-full"
            />
            {!update && (
              <>
                {errors.muscle && (
                  <span className="text-center text-red-500">
                    {errors.muscle}
                  </span>
                )}
                <select
                  name="muscle"
                  value={values.muscle}
                  onChange={handleChange}
                  className="bg-darkNavy text-gray px-2 py-1 rounded-lg w-full"
                >
                  <option>Choose target muscle</option>
                  {MUSCLE.map((muscle) => (
                    <option key={muscle} value={muscle}>
                      {muscle}
                    </option>
                  ))}
                </select>
                {errors.difficulty && (
                  <span className="text-center text-red-500">
                    {errors.difficulty}
                  </span>
                )}
                <select
                  name="difficulty"
                  value={values.difficulty}
                  onChange={handleChange}
                  className="bg-darkNavy text-gray px-2 py-1 rounded-lg w-full"
                >
                  <option>Choose difficulty</option>
                  {DIFFICULTY.map((difficulty) => (
                    <option key={difficulty} value={difficulty}>
                      {difficulty}
                    </option>
                  ))}
                </select>
                {errors.type && (
                  <span className="text-center text-red-500">
                    {errors.type}
                  </span>
                )}
                <select
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  className="bg-darkNavy text-gray px-2 py-1 rounded-lg w-full"
                >
                  <option>Choose exercise type</option>
                  {TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.equipment && (
                  <span className="text-center text-red-500">
                    {errors.equipment}
                  </span>
                )}
              </>
            )}
            <select
              name="equipment"
              value={values.equipment}
              onChange={handleChange}
              className="bg-darkNavy text-gray px-2 py-1 rounded-lg w-full"
            >
              <option>Choose equipment</option>
              {EQUIPMENT.map((equipment) => (
                <option key={equipment} value={equipment}>
                  {equipment}
                </option>
              ))}
            </select>
            <textarea
              name="instructions"
              value={values.instructions}
              onChange={handleChange}
              placeholder="Instructions"
              className="p-2 rounded-lg bg-darkNavy text-silver active:outline-none focus:outline-none w-full h-64"
            />
            <div className="flex flex-row gap-2">
              {!update ? (
                <button
                  type="submit"
                  className="bg-green-500 text-2xl px-4 py-1 rounded-md font-bold text-silver hover:bg-white hover:text-darkNavy"
                >
                  Create
                </button>
              ) : (
                <button
                  type="submit"
                  className="bg-blue-500 text-2xl px-4 py-1 rounded-md font-bold text-silver hover:bg-white hover:text-darkNavy"
                >
                  Update
                </button>
              )}
              <button
                type="button"
                className="bg-blue-500 text-2xl px-4 py-1 rounded-md font-bold text-silver hover:bg-white hover:text-darkNavy"
                onClick={() => {
                  navigate("/exercises");
                }}
              >
                Go Back
              </button>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default ExerciseForm;
