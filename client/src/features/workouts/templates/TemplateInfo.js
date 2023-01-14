import React from "react";
import Button from "../../../components/UI/Button";
import ExerciseMoreInfo from "./ExerciseMoreInfo";

const TemplateInfo = ({ template, templateId, onClose }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-center text-4xl font-bold text-white">
        {template.name}
      </h1>
      <ul className="flex flex-col px-2 gap-2 w-96 max-h-96 overflow-auto scrollbar">
        {template.exercises.map((exercise, index) => (
          <li
            className="bg-darkNavy rounded-xl text-white px-6 py-4 hover:cursor-pointer"
            key={index}
          >
            <ExerciseMoreInfo exercise={exercise} />
          </li>
        ))}
      </ul>
      <Button
        className="text-2xl font-bold text-white bg-blue-500 p-2 rounded-xl hover:bg-white hover:text-darkNavy"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  );
};

export default TemplateInfo;
