import React from "react";

const DeleteWorkoutModal = ({ onClose, onDelete }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-white font-bold text-3xl text-center">
        Are you sure
        <br />
        you want to delete
        <br />
        this workout?
      </h1>
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
            onDelete();
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteWorkoutModal;
