import React from "react";
import whiteLogo from "../images/higly-logo-white.png";
import { useSelector, useDispatch } from "react-redux";
import { authActions } from "../app/auth-slice";
import { NavLink } from "react-router-dom";
import { useCookies } from "react-cookie";

const NavBar = () => {
  const [cookies, setCookie, removeCookie] = useCookies([
    "AuthToken",
    "Username",
    "UserId",
  ]);
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleLogout = () => {
    removeCookie("AuthToken");
    removeCookie("Username");
    removeCookie("UserId");
    dispatch(authActions.logout());
  };

  return (
    <div className="flex flex-row w-full h-18 bg-darkNavy font-normal text-white justify-between">
      <div className="flex ml-6 h-16 gap-1">
        <NavLink to="/" className="mr-6">
          <img className="h-16" src={whiteLogo} alt="logo" />
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-4 py-2 rounded-md self-center outline-none hover:border-white border-transparent border-2"
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/start"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-4 py-2 rounded-md self-center hover:border-white border-transparent border-2"
          }
        >
          Start Workout
        </NavLink>
        <NavLink
          to="/history"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-4 py-2 rounded-md self-center hover:border-white border-transparent border-2"
          }
        >
          History
        </NavLink>
        <NavLink
          to="/exercises"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-4 py-2 rounded-md self-center hover:border-white border-transparent border-2"
          }
        >
          Exercises
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) =>
            (isActive ? "bg-white text-black" : "") +
            " px-2 py-2 rounded-md self-center hover:border-white border-transparent border-2"
          }
        >
          Profile
        </NavLink>
      </div>
      {!isAuthenticated ? (
        <div className="flex flex-row justify-self-end mr-6 gap-1">
          <NavLink
            to="/login"
            className={({ isActive }) =>
              (isActive ? "bg-white text-black" : "") +
              " px-4 py-2 rounded-md self-center hover:border-white border-transparent border-2"
            }
          >
            Login
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              (isActive ? "bg-white text-black" : "") +
              " px-4 py-2 rounded-md self-center hover:border-white border-transparent border-2"
            }
          >
            Sign Up
          </NavLink>
        </div>
      ) : (
        <div className="flex flex-row justify-self-end mr-6 gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              (isActive ? "bg-white text-black" : "") +
              " px-4 py-2 rounded-md self-center hover:border-white border-transparent border-2"
            }
            onClick={handleLogout}
          >
            Logout
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default NavBar;
