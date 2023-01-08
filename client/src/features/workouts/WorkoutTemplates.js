import React, { useState } from "react";
import { selectFolders } from "./folderSlice";
import { useSelector } from "react-redux";
import Folder from "./templates/Folder";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";

const WorkoutTemplates = () => {
  const [showAddFolder, setShowAddFolder] = useState(false);
  const templateFolders = useSelector(selectFolders);

  return (
    <>
      <div className="w-3/4 m-auto mt-6 flex flex-col gap-2">
        <div className="flex flex-row justify-between border-solid border-b-2 mb-2 border-darkGray">
          <h2 className="text-silver text-3xl p-4">Templates</h2>
          <div className="flex flex-row gap-2">
            <Button className="text-center bg-darkNavy self-center">
              New template
            </Button>
            <Button
              className="text-center bg-darkNavy self-center"
              onClick={() => setShowAddFolder(true)}
            >
              New folder
            </Button>
          </div>
        </div>
        {templateFolders.map((folder, index) => (
          <Folder key={folder.folderId} folder={folder} />
        ))}
      </div>
      {showAddFolder && <Modal onClose={() => setShowAddFolder(false)} />}
    </>
  );
};

export default WorkoutTemplates;
