import React from "react";
import Button from "../../../components/UI/Button";

const UpdateTemplate = ({ template, templateId, onClose }) => {
  return (
    <div>
      <div>{templateId}</div>
      <div>{template.name}</div>
      <div>
        {template.exercises.map((exercise, index) => (
          <div key={index}>{exercise.exerciseName}</div>
        ))}
      </div>
      <div className="flex flex-row self-center items-center gap-2 p-2 mt-2">
        <Button
          className="text-2xl font-bold text-white bg-green-500 p-2 rounded-md"
          onClick={() => {}}
        >
          Update
        </Button>
        <Button
          className="text-2xl font-bold text-white bg-red-600 p-2 rounded-md"
          onClick={onClose}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default UpdateTemplate;
