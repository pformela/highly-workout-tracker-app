import React, { useState } from "react";
import { useCreateTemplateFolderMutation } from "./folderApiSlice";
import { selectUsername } from "../../user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { folderActions } from "./folderSlice";

const CreateNewFolder = (props) => {
  const [folderName, setFolderName] = useState("");
  const [folderNameIsValid, setFolderNameIsValid] = useState(true);
  const username = useSelector(selectUsername);
  const [createFolder] = useCreateTemplateFolderMutation();

  const dispatch = useDispatch();

  const handleFolderNameChange = (e) => {
    if (e.target.value.trim().length > 0) {
      setFolderNameIsValid(true);
    } else {
      setFolderNameIsValid(false);
    }
    setFolderName(e.target.value);
  };

  const addNewFolder = async () => {
    if (folderName.trim().length === 0) {
      setFolderNameIsValid(false);
    } else {
      try {
        const result = await createFolder({
          username,
          folderName,
        });
        dispatch(folderActions.addFolder(result.data));
        props.onClose();
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <div className="flex flex-col justify-between">
      <h2 className="text-2xl text-white text-center">Add a new folder</h2>
      <input
        className="bg-darkNavy p-2 rounded-md mt-4 text-white"
        value={folderName}
        onChange={handleFolderNameChange}
        type="text"
        placeholder="Folder name"
      ></input>
      {!folderNameIsValid && (
        <p className="text-red-500 p-2 text-center">
          Folder name cannot be empty
        </p>
      )}
      <div className="flex flex-row self-center items-center gap-2 p-2 mt-2">
        <button
          className="text-2xl font-bold text-white bg-green-500 p-2 rounded-md"
          disabled={!folderNameIsValid}
          onClick={addNewFolder}
        >
          Add
        </button>
        <button
          className="text-2xl font-bold text-white bg-red-600 p-2 rounded-md"
          onClick={props.onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateNewFolder;
