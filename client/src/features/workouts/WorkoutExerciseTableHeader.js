import React from "react";

const WorkoutExerciseTableHeader = ({ id }) => {
  return (
    <ul className="flex flex-row text-white text-xl  text-center p-4 font-bold justify-between">
      <li key={`ex${id}`} className="w-96">
        Exercise
      </li>
      <div className="flex flex-row gap-2">
        <li key={`set${id}`} className="w-12">
          Set
        </li>
        <li key={`kgs${id}`} className="w-20">
          kgs
        </li>
        <li key={`reps${id}`} className="w-16">
          Reps
        </li>
        <li key={`tick${id}`} className="w-16 px-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </li>
      </div>
    </ul>
  );
};

export default WorkoutExerciseTableHeader;
