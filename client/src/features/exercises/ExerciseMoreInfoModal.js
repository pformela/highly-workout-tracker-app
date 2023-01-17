import React from "react";

const ExerciseMoreInfoModal = ({ exercise, onClose }) => {
  return (
    <div className="flex flex-col gap-2 w-96">
      <h1 className="text-white text-4xl font-bold">{exercise.exerciseName}</h1>
      <p className="text-white text-md font-bold">
        Equipment: <span className="font-normal">{exercise.equipment}</span>
      </p>
      <p className="text-white text-md font-bold overflow-auto px-4 py-1 scrollbar h-64 border border-darkNavy rounded-xl">
        Instructions:
        <br />
        <span className="font-normal">{exercise.instructions}</span>
      </p>
      <button
        onClick={onClose}
        className="mt-6 self-center w-32 px-6 py-2 bg-blue-500 border-2 border-blue-500 hover:border-white text-white rounded-md font-bold"
      >
        Close
      </button>
    </div>
  );
};

export default ExerciseMoreInfoModal;
