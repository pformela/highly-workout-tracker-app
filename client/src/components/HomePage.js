import React from "react";
import { Navigate } from "react-router-dom";
import NavBar from "./NavBar";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-navy">
      <NavBar />
      <h1 className="text-6xl text-white text-center mt-6">Home</h1>
      {/* <Navigate replace to="/startWorkout" /> */}
    </div>
  );
};

export default HomePage;
