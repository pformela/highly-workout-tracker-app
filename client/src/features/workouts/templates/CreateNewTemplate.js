import React from "react";
import Button from "../../../components/UI/Button";
import SelectFolder from "./SelectFolder";

const CreateNewTemplate = ({ onClose }) => {
  return (
    <div className="flex flex-col gap-4">
      <SelectFolder />
      <Button
        className="flex self-center bg-red-500 text-xl font-bold"
        onClick={onClose}
      >
        Close
      </Button>
    </div>
  );
};

export default CreateNewTemplate;
