import React, { useState } from "react";
import { useSelector } from "react-redux";
import ExercisesPageNavigation from "./ExercisesPageNavigation";
import Exercise from "./Exercise";

const FoundExercises = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const exercises = useSelector((state) => state.exercise.exercises);
  const count = useSelector((state) => state.exercise.count);
  const filter = useSelector((state) => state.exercise.filter);
  const loading = useSelector((state) => state.exercise.loading);

  return (
    <div>
      {exercises.length !== 0 ? (
        <ExercisesPageNavigation
          count={count}
          filter={filter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
      <ul className="flex flex-col list-none gap-2 w-3/5 mx-auto">
        {loading ? (
          <div className="bg-gray text-navy mt-4 p-4 rounded-xl mx-auto flex flex-col justify-center items-center gap-2 w-2/3">
            <h1 className="text-3xl">Loading...</h1>
          </div>
        ) : null}
        {exercises.length === 0 ? (
          <div className="bg-gray text-navy mt-4 p-4 rounded-xl mx-auto flex flex-col justify-center items-center gap-2 w-2/3">
            <h1 className="text-3xl">No Results</h1>
            <p className="text-xl">Try a different search</p>
          </div>
        ) : (
          exercises.map((exercise, index) => (
            <li key={index}>
              <Exercise
                name={exercise.name}
                labels={exercise.labels}
                equipment={exercise.equipment}
                instructions={exercise.instructions}
              />
            </li>
          ))
        )}
      </ul>
      {exercises.length !== 0 ? (
        <ExercisesPageNavigation
          count={count}
          filter={filter}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      ) : null}
    </div>
  );
};

export default FoundExercises;
