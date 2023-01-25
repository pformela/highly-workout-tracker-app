import React from "react";
import Button from "../../../components/UI/Button";
import { selectUsername } from "../../user/userSlice";
import { useSelector } from "react-redux";
import { useDeleteTemplateMutation } from "../templates/templateApiSlice";

const DeleteTemplate = ({ folderId, templateId, templateName, onClose }) => {
  const username = useSelector(selectUsername);
  const [deleteTemplate] = useDeleteTemplateMutation();

  const handleDelete = () => {
    try {
      deleteTemplate({
        username,
        folderId,
        templateId,
      }).unwrap();
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-3xl text-white pb-4 text-center">
        Are you sure <br />
        you want to delete <br />
        <span className="font-bold self-center">{templateName}</span>?
      </h1>
      <div className="flex flex-row self-center items-center gap-2 p-2 mt-2">
        <Button
          className="text-2xl font-bold text-white bg-blue-500 p-2 rounded-md"
          onClick={handleDelete}
        >
          Delete
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

export default DeleteTemplate;
