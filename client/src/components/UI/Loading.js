import React from "react";
import whiteLogo from "../../images/higly-logo-white.png";

const Loading = () => {
  return (
    <div className="bg-darkNavy min-h-screen flex flex-col pt-80">
      <img className="self-center w-1/3" src={whiteLogo} alt="logo" />
      <div className="text-3xl text-darkGray font-bold text-center mb-6">
        Loading
      </div>
      <div className="flex flex-row justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-darkGray"></div>
      </div>
    </div>
  );
};

export default Loading;
