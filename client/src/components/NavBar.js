import React from "react";
import whiteLogo from "../images/higly-logo-white.png";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <div className="flex flex-col w-full h-18 bg-darkNavy font-normal text-white justify-center">
      <div className="flex mx-6 h-16 gap-1">
        <NavLink to="/" className="mr-6">
          <img className="h-16" src={whiteLogo} alt="logo" />
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-6 py-2 rounded-md self-center outline-none hover:border-white border-transparent border-2"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/start"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-6 py-2 rounded-md self-center hover:border-white border-transparent border-2"
          }
        >
          Start Workout
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-6 py-2 rounded-md self-center hover:border-white border-transparent border-2"
          }
        >
          History
        </NavLink>
        <NavLink
          to="/exercises"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-6 py-2 rounded-md self-center hover:border-white border-transparent border-2"
          }
        >
          Exercises
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-6 py-2 rounded-md self-center hover:border-white border-transparent border-2"
          }
        >
          Profile
        </NavLink>
      </div>
    </div>
  );
};

export default NavBar;
