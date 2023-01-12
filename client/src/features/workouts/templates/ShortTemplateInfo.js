import React from "react";

const ShortTemplateInfo = ({ template }) => {
  const exerciseContent = template.exercises.reduce((acc, exercise) => {});

  return (
    <div className="flex flex-col bg-gray border-4 border-darkNavy rounded-md w-60">
      <h1 className="text-silver text-xl font-bold bg-darkNavy p-2">
        {template.name}
      </h1>
      <div className="p-2">
        {template.exercises.map((exercise) => (
          <div key={exercise.exerciseId} className="flex flex-row">
            <h1 className="text-darkNavy text-md">{exercise.exerciseName}</h1>
            <h1 className="text-darkNavy text-md">
              {exercise.sets} x {exercise.reps} x {exercise.weight}
            </h1>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShortTemplateInfo;
