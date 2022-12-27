import React from "react";
import NavBar from "./NavBar";
import Button from "./UI/Button";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div className="h-screen bg-navy text-white">
      <NavBar />
      <div className="mt-12 flex flex-col justify-center gap-6">
        <h1 className="self-center text-6xl">Page Not Found</h1>
        <Link to="/" className="self-center">
          <Button className="bg-gray text-3xl font-bold">
            Go to Home Page
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
