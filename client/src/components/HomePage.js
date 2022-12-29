import React from "react";
import NavBar from "./NavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-navy">
      <NavBar />
      <h1 className="text-6xl text-white text-center mt-6">Home</h1>
    </div>
  );
};

export default HomePage;
