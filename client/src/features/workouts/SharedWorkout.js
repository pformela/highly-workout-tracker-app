import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectCurrentSharedWorkout,
  selectIsCurrentSharedWorkoutEmpty,
} from "./workoutSlice";
import { useGetSingleWorkoutMutation } from "./workoutApiSlice";
import whiteLogo from "../../images/higly-logo-white.png";
import Loading from "../../components/UI/Loading";

const SharedWorkout = () => {
  const { username, workoutId } = useParams();
  const workout = useSelector(selectCurrentSharedWorkout);
  const isCurrentSharedWorkoutEmpty = useSelector(
    selectIsCurrentSharedWorkoutEmpty
  );

  const [getSingleWorkout, { data, isLoading }] = useGetSingleWorkoutMutation();

  const fetchWorkout = async () => {
    try {
      console.log(username, workoutId);
      const response = await getSingleWorkout({ username, workoutId });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (JSON.stringify(workout) === "{}" && !isCurrentSharedWorkoutEmpty)
      fetchWorkout();
  }, []);

  const headerContent = (
    <div className="flex flex-col mb-12">
      <img src={whiteLogo} className="w-3/5 self-center" />
      <h1 className="text-4xl text-white text-center">
        Start your workout journey{" "}
        <Link target="_blank" rel="noopener noreferrer" to="/signup">
          <span className="font-bold underline text-blue-500">here</span>
        </Link>
      </h1>
    </div>
  );

  const content =
    JSON.stringify(workout) === "{}" ? (
      <div className="text-4xl text-center text-white">
        No workout found under this link.
      </div>
    ) : (
      <>
        <h1 className="text-3xl text-white self-center">
          Workout shared by <span className="font-bold">{username}</span>
        </h1>
        <div className="w-1/2 bg-darkNavy border-2 border-darkGray rounded-xl p-4 self-center">
          <div className="flex flex-row justify-between">
            <h1 className="text-white font-bold text-xl self-center">
              {workout.templateName}
            </h1>
          </div>
          <div className="text-darkGray text-xl">{workout.formattedDate}</div>
          <div className="flex flex-row">
            <div className="w-1/3 flex gap-2 flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-darkGray self-center"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="text-darkGray text-xl text-center">
                {workout.duration.hours > 0
                  ? `${workout.duration.hours}h `
                  : ""}
                {workout.duration.minutes}m
              </span>
            </div>
            <div className="w-1/3 flex gap-2 flex-row">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-darkGray self-center"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
                />
              </svg>
              <span className="text-darkGray text-xl text-center">
                {workout.volume}kg
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row">
              <h3 className="w-1/2 text-white text-xl font-bold">Exercise</h3>
              <h3 className="w-1/2 text-white text-xl font-bold">Best Set</h3>
            </div>
            {Object.keys(workout.exercises).map((exercise, index) => {
              return (
                <div
                  key={`ex${workoutId}${index}`}
                  className="flex flex-row gap-2 text-darkGray"
                >
                  <div className="w-1/2">
                    {Object.keys(workout.exercises[exercise].sets).length} x{" "}
                    {workout.exercises[exercise].exerciseName.length > 28
                      ? workout.exercises[exercise].exerciseName.substring(
                          0,
                          28
                        ) + "..."
                      : workout.exercises[exercise].exerciseName}
                  </div>
                  <div className="w-1/2">
                    {workout.exercises[exercise].bestSet.weight} kg x{" "}
                    {workout.exercises[exercise].bestSet.reps}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </>
    );

  return (
    <div className="flex flex-col bg-lighterDarkNavy min-h-screen min-w-screen  gap-6">
      {headerContent}
      {isLoading ? <Loading /> : content}
    </div>
  );
};

export default SharedWorkout;
