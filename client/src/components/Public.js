import React from "react";
import NavBar from "./NavBar";

const Public = () => {
  return (
    <div className="bg-navy min-h-screen">
      <NavBar />
      <div className="text-3xl text-white text-center mt-20">
        This is the public page.
      </div>
    </div>
  );
};

export default Public;
