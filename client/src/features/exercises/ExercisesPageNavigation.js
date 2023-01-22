import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { exerciseActions, selectExerciseCount } from "./exercisesSlice";

const ExercisesPageNavigation = ({ filter, currentPage, setCurrentPage }) => {
  const count = useSelector(selectExerciseCount);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row py-6 justify-center gap-2">
      <button
        className="bg-darkNavy text-white text-bold px-4 py-1 rounded-xl flex flex-col justify-center items-center gap-2 w-fit"
        onClick={() => {
          setCurrentPage(1);
          dispatch(exerciseActions.changePage(1));
        }}
        disabled={currentPage === 1}
      >
        First
      </button>
      <button
        className="bg-darkNavy text-white text-bold px-4 py-1 rounded-xl flex flex-col justify-center items-center gap-2 w-fit"
        onClick={() => {
          setCurrentPage(currentPage - 1);
          dispatch(exerciseActions.changePage(currentPage - 1));
        }}
        disabled={currentPage <= 1}
      >
        Previous
      </button>
      <div className="text-white self-center">
        Page {currentPage} of {Math.ceil(count / 25)}
      </div>
      <button
        className="bg-darkNavy text-white text-bold px-4 py-1 rounded-xl flex flex-col justify-center items-center gap-2 w-fit"
        onClick={() => {
          setCurrentPage(currentPage + 1);
          dispatch(exerciseActions.changePage(currentPage + 1));
        }}
        disabled={currentPage >= Math.ceil(count / 25)}
      >
        Next
      </button>
      <button
        className="bg-darkNavy text-white text-bold px-4 py-1 rounded-xl flex flex-col justify-center items-center gap-2 w-fit"
        onClick={() => {
          setCurrentPage(Math.ceil(count / 25));
          dispatch(exerciseActions.changePage(Math.ceil(count / 25)));
        }}
      >
        Last
      </button>
    </div>
  );
};

export default ExercisesPageNavigation;
