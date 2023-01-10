import React, { useState } from "react";
import { useUpdateTemplateFolderMutation } from "../folderApiSlice";
import Button from "../../../components/UI/Button";

const UpdateFolder = ({ folderName, username, folderId, onClose }) => {
  const [newFolderName, setNewFolderName] = useState(folderName);
  const [isNewFolderNameValid, setIsNewFolderNameValid] = useState(true);

  const [updateFolder, { isLoading }] = useUpdateTemplateFolderMutation();

  const handleFolderNameChange = (e) => {
    if (e.target.value.trim().length > 0) {
      setIsNewFolderNameValid(true);
    } else {
      setIsNewFolderNameValid(false);
    }

    setNewFolderName(e.target.value);
  };

  const updateFolderName = async () => {
    try {
      const result = await updateFolder({
        folderId,
        folderName: newFolderName,
        username,
      });
      console.log(result.data);
      onClose();
    } catch (err) {
      console.log(err);
    }
  };

  const handleFolderNameSubmit = () => {
    if (newFolderName.trim().length > 0) {
      updateFolderName();
    } else {
      setIsNewFolderNameValid(false);
    }
  };

  return (
    <div className="flex flex-row bg-darkNavy rounded-xl gap-2 justify-between">
      <input
        className={`p-3 m-2 text-xl rounded-xl border-2 border-darkNavy bg-darkGray text-silver font-bold ${
          !isNewFolderNameValid ? "border-red-500" : ""
        }`}
        type="text"
        name="folderName"
        value={newFolderName}
        placeholder="Enter new folder name"
        onChange={handleFolderNameChange}
      />
      {!isNewFolderNameValid ? (
        <h1 className="text-red-500 text-md self-center">
          Folder name should contain at least one character.
        </h1>
      ) : (
        ""
      )}
      <div className="flex flex-row gap-2 pr-4">
        <Button
          className="flex flex-row bg-green-500 h-10 self-center rounded-xl border-2 border-green-500 hover:border-white"
          onClick={handleFolderNameSubmit}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 self-center"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </Button>
        <Button
          className="flex flex-row bg-red-500 h-10 self-center rounded-xl border-2 border-red-500 hover:border-white"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-8 h-8 self-center"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default UpdateFolder;
