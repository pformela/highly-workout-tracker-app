import React, { useEffect, useState } from "react";
import { useGetWorkoutsMutation } from "../workouts/workoutApiSlice";
import { selectUsername } from "../user/userSlice";
import {
  selectWorkoutHistory,
  selectIsWorkoutHistoryEmpty,
  selectCurrentPageWorkouts,
} from "../workouts/workoutSlice";
import { useSelector } from "react-redux";
import NavBar from "../../components/NavBar";
import Training from "./Training";
import HistoryFilter from "./HistoryFilter";
import HistorySort from "./HistorySort";
import HistoryPageNavigation from "./HistoryPageNavigation";

const TrainingHistory = () => {
  const [getWorkouts] = useGetWorkoutsMutation();
  const username = useSelector(selectUsername);
  const workouts = useSelector(selectCurrentPageWorkouts);
  const allWorkouts = useSelector(selectWorkoutHistory);
  const isEmpty = useSelector(selectIsWorkoutHistoryEmpty);

  const [pageNumber, setPageNumber] = useState(1);

  const fetchWorkouts = async () => {
    try {
      await getWorkouts({ username });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (JSON.stringify(allWorkouts) === "{}" && !isEmpty) fetchWorkouts();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen bg-navy pb-6">
      <NavBar />
      <h1 className="text-5xl text-bold text-white mt-6 text-center">
        Training History
      </h1>
      <HistoryFilter pageNumber={pageNumber} setPageNumber={setPageNumber} />
      <HistorySort pageNumber={pageNumber} setPageNumber={setPageNumber} />
      <HistoryPageNavigation
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
      <ul className="flex flex-col mt-6 gap-4 bg-lighterDarkNavy p-4 w-3/5 m-auto text-black rounded-xl border-4 border-darkNavy">
        {Object.keys(workouts).length === 0 && (
          <li className="flex flex-col bg-darkNavy gap-1 p-4 rounded-xl">
            <h2 className="text-2xl text-bold text-white text-center">
              No workouts found
            </h2>
          </li>
        )}
        {Object.keys(workouts).map((workoutId, index) => {
          return (
            <li
              key={index}
              className="flex flex-col bg-darkNavy gap-1 p-4 rounded-xl"
            >
              <Training
                workout={workouts[workoutId]}
                workoutId={workoutId}
                index={index}
              />
            </li>
          );
        })}
      </ul>
      <HistoryPageNavigation
        pageNumber={pageNumber}
        setPageNumber={setPageNumber}
      />
    </div>
  );
};

export default TrainingHistory;
