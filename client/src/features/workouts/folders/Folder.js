import React, { useState } from "react";
import { useGetFolderTemplatesMutation } from "./folderApiSlice";
import { useSelector } from "react-redux";
import { selectUsername } from "../../user/userSlice";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import DeleteFolder from "./DeleteFolder";
import UpdateFolder from "./UpdateFolder";
import ShortTemplateInfo from "../templates/ShortTemplateInfo";

const Folder = ({ folder }) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [isInEditMode, setIsInEditMode] = useState(false);
  const [showDeleteTemplate, setShowDeleteTemplate] = useState(false);
  const username = useSelector(selectUsername);

  const [getTemplates] = useGetFolderTemplatesMutation();

  const getFolderTemplates = async () => {
    try {
      await getTemplates({
        folderId: folder.folderId,
        folderName: folder.name,
        username,
      });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col border-4 border-darkNavy bg-darkGray rounded-xl">
      {isInEditMode ? (
        <UpdateFolder
          folderName={folder.name}
          folderId={folder.folderId}
          username={username}
          onClose={() => setIsInEditMode(false)}
        />
      ) : (
        <>
          <div className="w-full bg-darkNavy rounded-md flex flex-row justify-between ">
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
                className="flex flex-row bg-blue-500 w-min h-10 px-4 self-center rounded-xl border-2 border-blue-500 hover:border-white"
                onClick={() => setIsInEditMode(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="w-8 h-8 self-center"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                  />
                </svg>
              </Button>
              <Button
                className="flex flex-row bg-red-500 w-min h-10 px-4 self-center rounded-xl border-2 border-red-500 hover:border-white"
                onClick={() => setShowDeleteTemplate(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="black"
                  className="w-8 h-8 self-center p-0"
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
              <h2 className="text-darkNavy text-xl text-center w-max">
                Folder is empty
              </h2>
            )}
            <ul className="flex flex-row flex-wrap gap-6 justify-center">
              {Object.keys(folder.templates).map((templateId, index) => (
                <li key={templateId} className="flex flex-col">
                  <ShortTemplateInfo
                    template={folder.templates[templateId]}
                    folderId={folder.folderId}
                    templateId={templateId}
                  />
                </li>
              ))}
            </ul>
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
        </>
      )}
    </div>
  );
};

export default Folder;
