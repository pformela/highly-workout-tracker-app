import React, { useState } from "react";
import { useGetFolderTemplatesMutation } from "../folderApiSlice";
import { useSelector } from "react-redux";
import { selectUsername } from "../../user/userSlice";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import DeleteFolder from "./DeleteFolder";

const Folder = ({ folder }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showDeleteTemplate, setShowDeleteTemplate] = useState(false);
  const username = useSelector(selectUsername);

  const [getTemplates, { isLoading }] = useGetFolderTemplatesMutation();

  const getFolderTemplates = async () => {
    console.log("getting folder templates");
    try {
      const result = await getTemplates({
        folderId: folder.folderId,
        folderName: folder.name,
        username,
      });
      console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col bg-gray rounded-xl">
      <div className="w-full bg-darkNavy rounded-xl flex flex-row justify-between ">
        <h1 className="grow text-xl text-silver h-max w-max self-center font-bold pl-4">
          {folder.name}
        </h1>
        <div className="flex flex-row pr-4 gap-2">
          <div className="flex flex-col self-center p-4">
            <h1 className="text-center text-silver text-sm">Created At</h1>
            <h1 className="self-end text-silver text-sm">
              {folder.createdAt.slice(0, 10)}
            </h1>
          </div>
          <Button
            className="bg-darkGray border-2 border-darkNavy rounded-xl font-bold hover:border-silver hover:cursor-pointer w-auto h-12 self-center"
            onClick={() => {
              if (folder.isEmpty) {
                getFolderTemplates();
              }
              setShowTemplates((prev) => !prev);
            }}
          >
            Show Templates
          </Button>
          <Button
            className="bg-red-500 w-min h-10 px-4 self-center rounded-xl border-2 border-red-500 hover:border-white"
            onClick={() => setShowDeleteTemplate(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="black"
              className="w-6 h-6 p-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </Button>
        </div>
      </div>
      <div className={`${showTemplates ? "" : "hidden"} flex flex-row p-4`}>
        {folder.isEmpty && (
          <h2 className="text-silver text-xl text-center w-full">
            Folder is empty
          </h2>
        )}
        {Object.keys(folder.templates).map((templateId) => (
          <div key={templateId} className="flex flex-col">
            <h1 className="text-silver text-xl font-bold">
              {folder.templates[templateId].name}
            </h1>
            {folder.templates[templateId].exercises.map((exercise) => (
              <div key={exercise.exerciseId} className="flex flex-row">
                <h1 className="text-silver text-md">{exercise.exerciseName}</h1>
                <h1 className="text-silver text-md">
                  {exercise.sets} x {exercise.reps} x {exercise.weight}
                </h1>
              </div>
            ))}
          </div>
        ))}
      </div>
      {showDeleteTemplate && (
        <Modal>
          <DeleteFolder
            onClose={() => setShowDeleteTemplate(false)}
            folderId={folder.folderId}
            folderName={folder.name}
            username={username}
          />
        </Modal>
      )}
    </div>
  );
};

export default Folder;
