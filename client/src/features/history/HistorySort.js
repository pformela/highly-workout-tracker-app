import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { workoutActions } from "../workouts/workoutSlice";

const HistorySort = () => {
  const [activeSortMethod, setActiveSortMethod] = useState("");
  const [sortNameAscending, setSortNameAscending] = useState(true);
  const [sortDateAscending, setSortDateAscending] = useState(true);
  const [sortVolumeAscending, setSortVolumeAscending] = useState(true);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col text-white mt-4 pb-4 border-b-2 border-darkGray w-96 m-auto gap-4">
      <h1 className="self-center text-4xl">Sort results by</h1>
      <div className="flex flex-row gap-2 self-center">
        <button
          className={`px-6 py-2 text-xl font-bold rounded-md ${
            activeSortMethod === "date"
              ? "bg-green-500 border-2 border-green-500"
              : "bg-darkNavy hover:border-white border-2 border-darkNavy"
          }`}
          onClick={() => {
            setActiveSortMethod("date");
            dispatch(
              workoutActions.sortWorkoutHistory({
                type: "date",
                ascending: sortDateAscending,
              })
            );
            setSortDateAscending(!sortDateAscending);
          }}
        >
          Date
        </button>
        <button
          className={`px-6 py-2 text-xl font-bold rounded-md  ${
            activeSortMethod === "volume"
              ? "bg-green-500 border-2 border-green-500"
              : "bg-darkNavy hover:border-white border-2 border-darkNavy"
          }`}
          onClick={() => {
            setActiveSortMethod("volume");
            dispatch(
              workoutActions.sortWorkoutHistory({
                type: "volume",
                ascending: sortVolumeAscending,
              })
            );
            setSortVolumeAscending(!sortVolumeAscending);
          }}
        >
          Volume
        </button>
        <button
          className={`px-6 py-2 text-xl font-bold rounded-md ${
            activeSortMethod === "name"
              ? "bg-green-500 border-2 border-green-500"
              : "bg-darkNavy hover:border-white border-2 border-darkNavy "
          }`}
          onClick={() => {
            setActiveSortMethod("name");
            dispatch(
              workoutActions.sortWorkoutHistory({
                type: "name",
                ascending: sortNameAscending,
              })
            );
            setSortNameAscending(!sortNameAscending);
          }}
        >
          Name
        </button>
        <button
          className={`px-6 py-2 bg-red-500 text-xl font-bold rounded-md border-2 border-red-500 hover:border-white `}
          onClick={() => setActiveSortMethod("")}
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default HistorySort;
