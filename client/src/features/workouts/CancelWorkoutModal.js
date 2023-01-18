import React from "react";
import { useNavigate } from "react-router-dom";

const CancelWorkoutModal = ({ onClose }) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-white text-4xl text-center">
        Are you sure
        <br />
        you want to cancel
        <br />
        this workout?
      </h1>
      <span className="text-red-500 text-xl text-center underline-offset-1">
        Progress will not be saved
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
          className="text-white text-xl text-center bg-red-500 px-6 py-2 rounded-md font-bold border-2 border-red-500 hover:border-white"
          onClick={() => {
            navigate("/startWorkout");
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CancelWorkoutModal;
