import React from "react";
import NavBar from "../../components/NavBar";
import Login from "./Login";

const LoginComponent = () => {
  return (
    <div className="bg-navy min-h-screen">
      <NavBar />
      <Login />
    </div>
  );
};

export default LoginComponent;
