import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { exerciseActions } from "./exercisesSlice";

const ExercisesSort = ({ setCurrentPage }) => {
  const [activeSortMethod, setActiveSortMethod] = useState("");
  const [sortNameAscending, setSortNameAscending] = useState(true);
  const [sortMuscleAscending, setSortMuscleAscending] = useState(true);
  const [sortDifficultyAscending, setsortDifficultyAscending] = useState(true);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row justify-center text-white mt-4 w-2/3 m-auto gap-4">
      <h1 className="self-center text-3xl">Sort by</h1>
      <div className="flex flex-row gap-2 self-center">
        <button
          className={`px-6 py-2 text-xl font-bold rounded-md ${
            activeSortMethod === "name"
              ? "bg-green-500 border-2 border-green-500"
              : "bg-darkNavy hover:border-white border-2 border-darkNavy "
          }`}
          onClick={() => {
            dispatch(
              exerciseActions.sortExercises({
                sort: activeSortMethod,
                order: sortNameAscending,
              })
            );
            setActiveSortMethod("name");
            setCurrentPage(1);
            setSortNameAscending(!sortNameAscending);
          }}
        >
          Name
        </button>
        <button
          className={`px-6 py-2 text-xl font-bold rounded-md ${
            activeSortMethod === "muscle"
              ? "bg-green-500 border-2 border-green-500"
              : "bg-darkNavy hover:border-white border-2 border-darkNavy "
          }`}
          onClick={() => {
            dispatch(
              exerciseActions.sortExercises({
                sort: activeSortMethod,
                order: sortMuscleAscending,
              })
            );
            setActiveSortMethod("muscle");
            setCurrentPage(1);
            setSortMuscleAscending(!sortMuscleAscending);
          }}
        >
          Muscle
        </button>
        <button
          className={`px-6 py-2 text-xl font-bold rounded-md ${
            activeSortMethod === "difficulty"
              ? "bg-green-500 border-2 border-green-500"
              : "bg-darkNavy hover:border-white border-2 border-darkNavy "
          }`}
          onClick={() => {
            dispatch(
              exerciseActions.sortExercises({
                sort: activeSortMethod,
                order: sortDifficultyAscending,
              })
            );
            setActiveSortMethod("difficulty");
            setCurrentPage(1);
            setsortDifficultyAscending(!sortDifficultyAscending);
          }}
        >
          Difficulty
        </button>
        <button
          className={`px-6 py-2 bg-red-500 text-xl font-bold rounded-md border-2 border-red-500 hover:border-white `}
          onClick={() => {
            setActiveSortMethod("");
            dispatch(exerciseActions.resetSort());
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default ExercisesSort;
