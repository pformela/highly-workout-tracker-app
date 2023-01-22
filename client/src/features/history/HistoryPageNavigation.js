import React, { useState } from "react";
import { selectNumberOfResults } from "../workouts/workoutSlice";
import { useSelector, useDispatch } from "react-redux";
import { workoutActions } from "../workouts/workoutSlice";

const HistoryPageNavigation = () => {
  const numberOfResults = useSelector(selectNumberOfResults);
  const [pageNumber, setPageNumber] = useState(1);
  const numberOfPages = Math.max(Math.ceil(numberOfResults / 5), 1);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-row w-max m-auto gap-2 mt-6">
      <button
        className="px-4 py-2 rounded-md bg-darkNavy font-bold text-white"
        onClick={() => {
          dispatch(workoutActions.changePage(1));
          setPageNumber(1);
        }}
      >
        First
      </button>
      <button
        className="px-4 py-2 rounded-md bg-darkNavy font-bold text-white"
        onClick={() => {
          if (pageNumber > 1) {
            dispatch(workoutActions.changePage(pageNumber - 1));
            setPageNumber(pageNumber - 1);
          }
        }}
      >
        Prev
      </button>
      <span className="text-white self-center text-xl">
        Page {pageNumber} of {numberOfPages}
      </span>
      <button
        className="px-4 py-2 rounded-md bg-darkNavy font-bold text-white"
        onClick={() => {
          if (pageNumber < numberOfPages) {
            dispatch(workoutActions.changePage(pageNumber + 1));
            setPageNumber(pageNumber + 1);
          }
        }}
      >
        Next
      </button>
      <button
        className="px-4 py-2 rounded-md bg-darkNavy font-bold text-white"
        onClick={() => {
          dispatch(workoutActions.changePage(numberOfPages));
          setPageNumber(numberOfPages);
        }}
      >
        Last
      </button>
    </div>
  );
};

export default HistoryPageNavigation;
