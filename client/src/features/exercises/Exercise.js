import React, { useState } from "react";
import { TYPES, MUSCLE, DIFFICULTY } from "./Exercises";
import abdominals from "../../images/muscle_groups/abdominals.png";
import calves from "../../images/muscle_groups/calves.png";
import chest from "../../images/muscle_groups/chest.png";
import forearms from "../../images/muscle_groups/forearms.png";
import glutes from "../../images/muscle_groups/glutes.png";
import hamstrings from "../../images/muscle_groups/hamstrings.png";
import lats from "../../images/muscle_groups/lats.png";
import lower_middle_back from "../../images/muscle_groups/lower_middle_back.png";
import neck from "../../images/muscle_groups/neck.png";
import quadriceps from "../../images/muscle_groups/quadriceps.png";
import traps from "../../images/muscle_groups/traps.png";
import triceps from "../../images/muscle_groups/triceps.png";
import biceps from "../../images/muscle_groups/biceps.png";
import no_muscle from "../../images/muscle_groups/no_muscle.png";

const MUSCLE_IMAGES = {
  Abdominals: abdominals,
  Abductors: quadriceps,
  Adductors: quadriceps,
  Biceps: biceps,
  Calves: calves,
  Chest: chest,
  Forearms: forearms,
  Glutes: glutes,
  Hamstrings: hamstrings,
  Lats: lats,
  Lower_back: lower_middle_back,
  Middle_back: lower_middle_back,
  Neck: neck,
  Quadriceps: quadriceps,
  Traps: traps,
  Triceps: triceps,
  NoMuscle: no_muscle,
};

const Exercise = ({ exercise }) => {
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const labels = exercise.labels.filter((label) => label !== "Exercise");
  const type = labels.find((label) => TYPES.includes(label));
  const muscle = labels.find((label) => MUSCLE.includes(label));
  const difficulty = labels.find((label) => DIFFICULTY.includes(label));

  return (
    <div
      className="flex flex-row gap-4 bg-darkNavy rounded-xl text-white px-6 py-4"
      onClick={() => setShowMoreInfo((prev) => !prev)}
    >
      <div className="flex flex-col gap-2 w-4/5">
        <h3 className="text-xl font-bold">{exercise.name}</h3>
        {!showMoreInfo ? (
          <p>
            {exercise.instructions.length > 200
              ? exercise.instructions.substring(0, 200) + "..."
              : exercise.instructions}
          </p>
        ) : (
          <>
            <p>{exercise.instructions}</p>
            <p className="font-bold">
              Equipment:{" "}
              <span className="font-normal">{exercise.equipment}</span>
            </p>
          </>
        )}
        <div className="flex flex-row gap-2">
          {type && (
            <span
              key={`t${exercise.exerciseId}`}
              className="bg-gradient-to-r from-pink-500 to-yellow-500 p-1 rounded-md"
            >
              {type}
            </span>
          )}
          {muscle && (
            <span
              key={`m${exercise.exerciseId}`}
              className="bg-gradient-to-r from-green-400 to-blue-500 p-1 rounded-md"
            >
              {muscle}
            </span>
          )}
          {difficulty && (
            <span
              key={`d${exercise.exerciseId}`}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-md"
            >
              {difficulty}
            </span>
          )}
        </div>
      </div>
      <div
        className={`flex flex-col self-center bg-lighterDarkNavy rounded-xl w-1/5 h-full ${
          showMoreInfo && "items-start"
        }`}
      >
        {muscle ? (
          <img src={MUSCLE_IMAGES[muscle]} alt={muscle} />
        ) : (
          <img src={MUSCLE_IMAGES["NoMuscle"]} alt="No muscle" />
        )}
      </div>
    </div>
  );
};

export default Exercise;
