import React from "react";
import whiteLogo from "../images/higly-logo-white.png";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex flex-col w-full h-20 bg-darkNavy text-white justify-center">
      <div className="flex mx-6 h-16">
        <NavLink to="/" className="mr-6">
          <img className="h-16" src={whiteLogo} alt="logo" />
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            (isActive ? "bg-gray text-darkNavy" : "") +
            " px-6 py-2 rounded-md self-center"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/start"
          className={({ isActive }) =>
            (isActive ? "bg-gray text-darkNavy" : "") +
            " px-6 py-2 rounded-md self-center"
          }
        >
          Start Workout
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            (isActive ? "bg-gray text-darkNavy" : "") +
            " px-6 py-2 rounded-md self-center"
          }
        >
          History
        </NavLink>
        <NavLink
          to="/exercises"
          className={({ isActive }) =>
            (isActive ? "bg-gray text-darkNavy" : "") +
            " px-6 py-2 rounded-md self-center"
          }
        >
          Exercises
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            (isActive ? "bg-gray text-darkNavy" : "") +
            " px-6 py-2 rounded-md self-center"
          }
        >
          Profile
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
