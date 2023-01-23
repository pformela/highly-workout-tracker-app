import React, { useState } from "react";
import Button from "../../components/UI/Button";
import { TYPES, MUSCLE, DIFFICULTY } from "./Exercises";

const PickAnExercise = (props) => {
  const [show, setShow] = useState(false);
  const labels = props.labels.filter((label) => label !== "Exercise");

  return (
    <div
      className="flex flex-col gap-2 bg-darkNavy rounded-xl text-white px-6 py-4 hover:cursor-pointer"
      onClick={() => setShow((prev) => !prev)}
    >
      <div className="flex flex-row justify-between">
        <h3 className="text-xl font-bold">{props.name}</h3>
        <Button
          className="flex flex-col bg-green-500 h-8 justify-center font-bold rounded-xl border-2 border-green-500 hover:border-white"
          onClick={() => {
            props.onSelect(props.name, props.exerciseId);
            console.log("props.name: " + props.name);
          }}
        >
          Select
        </Button>
      </div>
      {show && (
        <div className="flex flex-col gap-2">
          <p className="font-bold">
            Equipment: <span className="font-normal">{props.equipment}</span>
          </p>
          <p className="font-bold">
            Instructions: <br />
            <span className="font-normal">{props.instructions}</span>
          </p>
        </div>
      )}
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

          return null;
        })}
      </div>
    </div>
  );
};

export default PickAnExercise;
