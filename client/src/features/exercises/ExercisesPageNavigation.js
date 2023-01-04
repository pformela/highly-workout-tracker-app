import React from "react";
import { useDispatch } from "react-redux";
import { fetchExercises } from "./exercisesSlice";

const ExercisesPageNavigation = ({
  filter,
  currentPage,
  setCurrentPage,
  count,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row py-6 justify-center gap-2">
      <button
        className="bg-darkNavy text-white text-bold px-4 py-1 rounded-xl flex flex-col justify-center items-center gap-2 w-fit"
        onClick={() => {
          if (filter.offset > 0) {
            setCurrentPage(1);
            dispatch(fetchExercises({ ...filter, offset: 0 }));
          }
        }}
        disabled={currentPage === 1}
      >
        First Page
      </button>
      <button
        className="bg-darkNavy text-white text-bold px-4 py-1 rounded-xl flex flex-col justify-center items-center gap-2 w-fit"
        onClick={() => {
          if (filter.offset > 0) {
            setCurrentPage(currentPage - 1);
            dispatch(fetchExercises({ ...filter, offset: filter.offset - 25 }));
          }
        }}
        disabled={currentPage === 1}
      >
        Previous Page
      </button>
      <div className="text-white self-center">
        Page {currentPage} of {Math.ceil(count / 25)}
      </div>
      <button
        className="bg-darkNavy text-white text-bold px-4 py-1 rounded-xl flex flex-col justify-center items-center gap-2 w-fit"
        onClick={() => {
          if (filter.offset + 25 <= count) {
            dispatch(fetchExercises({ ...filter, offset: filter.offset + 25 }));
            setCurrentPage(currentPage + 1);
          }
        }}
      >
        Next Page
      </button>
      <button
        className="bg-darkNavy text-white text-bold px-4 py-1 rounded-xl flex flex-col justify-center items-center gap-2 w-fit"
        onClick={() => {
          if (filter.offset + 25 <= count) {
            dispatch(
              fetchExercises({
                ...filter,
                offset: Math.floor(count / 25) * 25,
              })
            );
            setCurrentPage(Math.ceil(count / 25));
          }
        }}
      >
        Last Page
      </button>
    </div>
  );
};

export default ExercisesPageNavigation;
