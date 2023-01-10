import React from "react";
import { useDeleteTemplateFolderMutation } from "./folderApiSlice";

const DeleteFolder = ({ onClose, folderId, folderName, username }) => {
  const [deleteFolder] = useDeleteTemplateFolderMutation();

  const handleDelete = async () => {
    try {
      await deleteFolder({ username, folderId });
      onClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <h1 className="text-xl text-white text-center">
        Are you sure you want to delete folder <br />
        <span className="font-bold text-2xl">{folderName}</span>
        <br />
        with all its content?
      </h1>
      <div className="flex flex-row self-center items-center gap-2 p-2 mt-2">
        <button
          className="text-2xl font-bold text-white bg-green-500 p-2 rounded-md"
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className="text-2xl font-bold text-white bg-red-600 p-2 rounded-md"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteFolder;
