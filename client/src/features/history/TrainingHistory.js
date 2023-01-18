import React, { useEffect } from "react";
import { useGetWorkoutsMutation } from "../workouts/workoutApiSlice";
import { selectUsername } from "../user/userSlice";
import {
  selectWorkoutHistory,
  selectIsWorkoutHistoryEmpty,
} from "../workouts/workoutSlice";
import { useSelector } from "react-redux";
import NavBar from "../../components/NavBar";

const TrainingHistory = () => {
  const [getWorkouts, { data, error, isLoading }] = useGetWorkoutsMutation();
  const username = useSelector(selectUsername);
  const workouts = useSelector(selectWorkoutHistory);
  const isEmpty = useSelector(selectIsWorkoutHistoryEmpty);
  const fetchWorkouts = async () => {
    try {
      const result = await getWorkouts({ username });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (JSON.stringify(workouts) === "{}" && !isEmpty) fetchWorkouts();
  }, []);

  return (
    <div className="min-h-screen bg-navy">
      <NavBar />
      <h1 className="text-center text-white text-6xl mt-6">Training History</h1>
      <div className="flex flex-col gap-2 bg-mediumDarkNavy">
        {Object.keys(workouts).map((workoutId) => {
          <h1>{workoutId}</h1>;
        })}
      </div>
    </div>
  );
};

export default TrainingHistory;
