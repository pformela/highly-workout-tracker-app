import React, { useState } from "react";
import { selectFolders } from "../folders/folderSlice";
import { useSelector } from "react-redux";
import { Formik } from "formik";

const SelectFolder = () => {
  const [targetedFolderId, setTargetedFolderId] = useState("");
  const folders = useSelector(selectFolders);

  return (
    <div>
      <select
        className="bg-darkNavy text-silver p-4 text-xl rounded-xl"
        name="folder"
        onChange={(e) => {
          setTargetedFolderId(e.target.value);
          console.log(e.target.value);
        }}
      >
        {folders.map((folder) => (
          <option key={folder.folderId} value={folder.folderId}>
            {folder.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectFolder;
