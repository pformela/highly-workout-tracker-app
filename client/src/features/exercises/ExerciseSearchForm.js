import React from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { exerciseActions } from "./exercisesSlice";

const ExerciseSearchForm = (props) => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        exerciseName: "",
        exerciseType: "",
        exerciseMuscle: "",
        exerciseDifficulty: "Any Difficulty",
      }}
      onSubmit={(values) => {
        const filter = {
          name: values.exerciseName,
          type:
            values.exerciseType === "Any Exercise Type"
              ? ""
              : values.exerciseType,
          muscle:
            values.exerciseMuscle === "Any Muscle Group"
              ? ""
              : values.exerciseMuscle,
          difficulty:
            values.exerciseDifficulty === "Any Difficulty"
              ? ""
              : values.exerciseDifficulty,
        };
        console.log(filter);
        dispatch(exerciseActions.filterExercises(filter));
        dispatch(exerciseActions.goBackToFirstPage());
        props.setCurrentPage(1);
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          className="p-6 mx-auto flex flex-col justify-center items-center gap-4 w-min border-b-2 border-gray border-opacity-50"
        >
          <div
            key="div-1"
            className="self-stretch h-min flex flex-row bg-darkNavy px-2 rounded-xl"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="silver"
              className="h-6 w-6 self-center"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              className="pl-1 px-2 py-2 rounded-lg bg-darkNavy text-silver active:outline-none focus:outline-none"
              key="nameInput"
              type="text"
              name="exerciseName"
              id="exerciseName"
              placeholder="Exercise Name"
              value={values.exerciseName}
              onChange={handleChange}
            />
          </div>
          <div key="div-2" className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <select
                name="exerciseType"
                key="typeSelect"
                id="exerciseType"
                value={values.exerciseType}
                onChange={handleChange}
                className="bg-darkNavy text-gray px-2 py-1 rounded-lg"
              >
                <option key="type-1" value="Any Exercise Type">
                  Any Exercise Type
                </option>
                {props.types.map((type, index) => (
                  <option key={`type${index}`} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              <select
                name="exerciseMuscle"
                id="exerciseMuscle"
                key="muscleSelect"
                value={values.exerciseMuscle}
                onChange={handleChange}
                className="bg-darkNavy text-gray px-2 py-1 rounded-lg"
              >
                <option key="muscle-1" value="Any Muscle Group">
                  Any Muscle Group
                </option>
                {props.muscle.map((muscle, index) => (
                  <option key={`muscle${index}`} value={muscle}>
                    {muscle}
                  </option>
                ))}
              </select>
            </div>
            <div
              key="div-3"
              className="flex flex-row flex-wrap text-md text-gray bg-darkNavy rounded-xl p-2 w-full self-center"
            >
              <div className="flex flex-row gap-2 w-1/2">
                <input
                  type="radio"
                  key="difficultyInput"
                  name="exerciseDifficulty"
                  value="Any Difficulty"
                  checked={values.exerciseDifficulty === "Any Difficulty"}
                  onChange={handleChange}
                  className="self-center w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label
                  key="-1label"
                  htmlFor="Any Difficulty"
                  className="self-center"
                >
                  Any Difficulty
                </label>
              </div>
              {props.difficulty.map((difficulty, index) => (
                <div
                  className="flex flex-row gap-2 w-1/2"
                  key={`diffDiv${index}`}
                >
                  <input
                    type="radio"
                    key={`diff${index}`}
                    name="exerciseDifficulty"
                    value={difficulty}
                    checked={values.exerciseDifficulty === difficulty}
                    onChange={handleChange}
                    className="self-center w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label
                    key={`difflabel${index}`}
                    htmlFor={difficulty}
                    className="self-center"
                  >
                    {difficulty}
                  </label>
                </div>
              ))}
            </div>
          </div>
          <button
            className="bg-darkNavy text-2xl px-4 py-1 rounded-md font-bold text-silver hover:bg-white hover:text-darkNavy"
            type="submit"
          >
            Search
          </button>
        </form>
      )}
    </Formik>
  );
};

export default ExerciseSearchForm;
