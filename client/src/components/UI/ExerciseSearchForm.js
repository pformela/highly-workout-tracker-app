import React from "react";
import { Formik } from "formik";
import { useDispatch } from "react-redux";
import { fetchExercises } from "../../redux/exercise-slice";

const ExerciseSearchForm = (props) => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        exerciseName: "",
        exerciseType: "",
        exerciseMuscle: "",
        exerciseDifficulty: "",
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
          offset: 0,
        };
        dispatch(fetchExercises(filter));
      }}
    >
      {({ values, handleChange, handleSubmit }) => (
        <form
          onSubmit={handleSubmit}
          className="p-6 mx-auto flex flex-col justify-center items-center gap-4 w-min border-b-2 border-gray border-opacity-50"
        >
          <div className="self-stretch h-min flex flex-row bg-darkNavy px-2 rounded-xl">
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
              type="text"
              name="exerciseName"
              id="exerciseName"
              placeholder="Exercise Name"
              value={values.exerciseName}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-row gap-2">
            <select
              name="exerciseType"
              id="exerciseType"
              value={values.exerciseType}
              onChange={handleChange}
              className="bg-darkNavy text-gray px-2 py-1 rounded-lg"
            >
              <option value="Any Exercise Type">Any Exercise Type</option>
              {props.types.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <select
              name="exerciseMuscle"
              id="exerciseMuscle"
              value={values.exerciseMuscle}
              onChange={handleChange}
              className="bg-darkNavy text-gray px-2 py-1 rounded-lg"
            >
              <option value="Any Muscle Group">Any Muscle Group</option>
              {props.muscle.map((muscle, index) => (
                <option key={index} value={muscle}>
                  {muscle}
                </option>
              ))}
            </select>
            <select
              name="exerciseDifficulty"
              id="exerciseDifficulty"
              value={values.exerciseDifficulty}
              onChange={handleChange}
              className="bg-darkNavy text-gray px-2 py-1 rounded-lg"
            >
              <option value="Any Difficulty">Any Difficulty</option>
              {props.difficulty.map((difficulty, index) => (
                <option key={index} value={difficulty}>
                  {difficulty}
                </option>
              ))}
            </select>
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
