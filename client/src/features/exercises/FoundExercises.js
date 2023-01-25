import React from "react";
import { useSelector } from "react-redux";
import ExercisesPageNavigation from "./ExercisesPageNavigation";
import Exercise from "./Exercise";
import PickAnExercise from "./PickAnExercise";
import { selectExerciseCount } from "./exercisesSlice";

const FoundExercises = ({
  pick,
  onSelect,
  currentPage,
  setCurrentPage,
  exercises,
}) => {
  const count = useSelector(selectExerciseCount);
  const loading = useSelector((state) => state.exercise.loading);

  return (
    <div>
      {exercises.length !== 0 ? (
        <ExercisesPageNavigation
          count={count}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
      <ul
        className={`flex flex-col list-none gap-2 ${
          pick ? "w-11/12" : "w-2/3"
        } mx-auto`}
      >
        {loading ? (
          <div className="bg-gray text-navy mt-4 p-4 rounded-xl mx-auto flex flex-col justify-center items-center gap-2 w-2/3">
            <h1 className="text-3xl">Loading...</h1>
          </div>
        ) : null}
        {exercises.length === 0 ? (
          <div
            className={`bg-gray text-navy mt-4 p-4 rounded-xl mx-auto flex flex-col justify-center items-center gap-2 ${
              pick ? "w-auto" : "w-2/3"
            }`}
          >
            <h1 className="text-3xl">No Results</h1>
            <p className="text-xl w-max">Try a different search</p>
          </div>
        ) : null}
        {!pick && exercises.length !== 0 ? (
          exercises.map((exercise, index) => (
            <li key={index}>
              <Exercise exercise={exercise} />
            </li>
          ))
        ) : (
          <div
            className={`flex flex-col gap-2 scrollbar h-80 w-max self-center overflow-auto ${
              exercises.length !== 0 ? " border-2 border-darkGray" : ""
            } rounded-xl p-4`}
          >
            {exercises.map((exercise, index) => (
              <li key={index}>
                <PickAnExercise
                  onSelect={onSelect}
                  name={exercise.name}
                  exerciseId={exercise.exerciseId}
                  labels={exercise.labels}
                  equipment={exercise.equipment}
                  instructions={exercise.instructions}
                />
              </li>
            ))}
          </div>
        )}
      </ul>
      {exercises.length !== 0 ? (
        <ExercisesPageNavigation
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
    </div>
  );
};

export default FoundExercises;
