import React from "react";

const Folder = ({ folder }) => {
  return (
    <div className="w-full bg-darkNavy rounded-xl flex flex-row justify-between">
      <h1 className="text-xl text-silver h-max self-center font-bold pl-4">
        {folder.name}
      </h1>
      <div className="flex flex-col self-center p-4">
        <h1 className="text-center text-silver text-md">Created At</h1>
        <h1 className="self-end text-silver text-md">
          {folder.createdAt.slice(0, 10)}
        </h1>
      </div>
    </div>
  );
};

export default Folder;
