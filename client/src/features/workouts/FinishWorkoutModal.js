import React from "react";
import { useNavigate } from "react-router-dom";

const FinishWorkoutModal = ({ onClose, onFinish }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-white text-4xl text-center">Finishing workout</h1>
      <span className="text-red-500 text-xl text-center">
        All unfinished sets will be marked as finished
      </span>
      <div className="flex flex-row self-center gap-2">
        <button
          className="text-white text-xl text-center bg-blue-500 px-6 py-2 rounded-md font-bold border-2 border-blue-500 hover:border-white"
          onClick={() => {
            onClose();
          }}
        >
          Go back
        </button>
        <button
          className="text-white text-xl text-center bg-green-500 px-6 py-2 rounded-md font-bold border-2 border-green-500 hover:border-white"
          onClick={() => {
            // navigate("/user/startWorkout");
            onFinish();
            onClose();
          }}
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default FinishWorkoutModal;
