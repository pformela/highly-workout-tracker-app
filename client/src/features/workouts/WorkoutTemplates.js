import React, { useState } from "react";
import { selectFolders } from "./folders/folderSlice";
import { useSelector } from "react-redux";
import Folder from "./folders/Folder";
import Button from "../../components/UI/Button";
import Modal from "../../components/UI/Modal";
import CreateNewFolder from "./folders/CreateNewFolder";
import CreateNewTemplate from "./templates/CreateNewTemplate";

const WorkoutTemplates = () => {
  const [showAddFolder, setShowAddFolder] = useState(false);
  const [showCreateTemplate, setShowCreateTemplate] = useState(false);
  const templateFolders = useSelector(selectFolders);

  return (
    <>
      <div className="w-3/4 m-auto mt-6 flex flex-col gap-3">
        <div className="flex flex-row justify-between border-solid border-b-2 mb-2 border-darkGray">
          <h2 className="text-silver text-3xl p-4">Templates</h2>
          <div className="flex flex-row gap-2">
            <Button
              className="text-center bg-darkNavy self-center"
              onClick={() => setShowCreateTemplate(true)}
            >
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
      {showAddFolder && (
        <Modal>
          <CreateNewFolder onClose={() => setShowAddFolder(false)} />
        </Modal>
      )}
      {showCreateTemplate && (
        <Modal>
          <CreateNewTemplate onClose={() => setShowCreateTemplate(false)} />
        </Modal>
      )}
    </>
  );
};

export default WorkoutTemplates;
