import React, { useState } from "react";

const ExerciseMoreInfo = ({ exercise }) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);

  return (
    <div
      className="flex flex-col hover:cursor-pointer gap-2"
      onClick={() => {
        setShowMoreInfo((prev) => !prev);
      }}
    >
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-bold">{exercise.exerciseName}</h2>
        <span className="self-center">
          {exercise.sets}x{exercise.reps}x{exercise.weight}kg
        </span>
      </div>
      {showMoreInfo && (
        <div>
          <h2>
            {" "}
            <span className="font-bold">Equpiment: </span>
            {exercise.exerciseEquipment}
          </h2>
          <h2>
            <span className="font-bold">Instructions: </span>
            <br />
            {exercise.exerciseInstructions}
          </h2>
        </div>
      )}
    </div>
  );
};

export default ExerciseMoreInfo;
