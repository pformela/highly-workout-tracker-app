import React, { useState } from "react";
import { Link } from "react-router-dom";

const ShareWorkoutModal = ({ username, workoutId, onClose }) => {
  const [isCopied, setIsCopied] = useState(false);
  const sharedWorkoutLink = `localhost:3000/shared/${username}/${workoutId}`;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-white font-bold text-3xl text-center">
        You can share this workout
        <br />
        with your friends
        <br />
        by sending them this link:
      </h1>
      <h3 className="text-gray">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          to={`/shared/${username}/${workoutId}`}
        >
          {sharedWorkoutLink}
        </Link>
      </h3>
      <div className="flex flex-row self-center gap-2">
        <button
          className={`text-white text-xl text-center px-6 py-2 rounded-md font-bold border-2 hover:border-white ${
            !isCopied
              ? "bg-blue-500 border-blue-500"
              : "bg-green-500 border-green-500"
          }`}
          onClick={() => {
            navigator.clipboard.writeText(sharedWorkoutLink);
            setIsCopied(true);
          }}
        >
          {!isCopied ? "Copy link" : "Link copied"}
        </button>
        <button
          className="text-white text-xl text-center bg-blue-500 px-6 py-2 rounded-md font-bold border-2 border-blue-500 hover:border-white"
          onClick={() => {
            onClose();
          }}
        >
          Go back
        </button>
      </div>
    </div>
  );
};

export default ShareWorkoutModal;
