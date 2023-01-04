import React from "react";
import { TYPES, MUSCLE, DIFFICULTY } from "./Exercises";

const Exercise = (props) => {
  const labels = props.labels.filter((label) => label !== "Exercise");
  return (
    <div className="flex flex-col gap-2 bg-darkNavy rounded-xl text-white px-6 py-4 hover:cursor-pointer">
      <h3 className="text-xl font-bold">{props.name}</h3>
      <p>
        {props.instructions.length > 210
          ? props.instructions.substring(0, 210) + "..."
          : props.instructions}
      </p>
      <div className="flex flex-row gap-2">
        {labels.map((el, index) => {
          if (TYPES.includes(el)) {
            return (
              <span
                key={`l${index}`}
                className="bg-gradient-to-r from-pink-500 to-yellow-500 text-white p-1 rounded-md"
              >
                {el}
              </span>
            );
          } else if (MUSCLE.includes(el)) {
            return (
              <span
                key={`l${index}`}
                className="bg-gradient-to-r from-green-400 to-blue-500 text-white p-1 rounded-md"
              >
                {el}
              </span>
            );
          } else if (DIFFICULTY.includes(el)) {
            return (
              <span
                key={`l${index}`}
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-1 rounded-md"
              >
                {el}
              </span>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Exercise;
