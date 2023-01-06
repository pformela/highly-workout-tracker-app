import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import NavBar from "../../components/NavBar";

const PersistLogin = () => {
  const [persist, setPersist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current || process.env.NODE_ENV === "development") {
      const verifyRefreshToken = async () => {
        console.log("verify refresh token");
        try {
          await refresh();
          setTrueSuccess(true);
        } catch (err) {
          console.log(err);
        }
      };
      if (!token && persist) {
        verifyRefreshToken();
      }
    }
    return () => (effectRan.current = true);
    // eslint-disable-next-line
  }, []);

  let content;
  if (!persist) {
    // persist is false
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    // persist is true, token is undefined
    console.log("loading");
    content = <div>Loading...</div>;
  } else if (isError) {
    // persist is true, token is undefined
    console.log("error");
    content = (
      <div className="min-h-screen bg-navy">
        <NavBar />
        <div className="text-2xl text-center text-white text-bold m-6">
          Something went wrong
        </div>

        <div className="text-xl text-center text-gray text-bold">
          <Link to="/login">Click here to login again</Link>
        </div>
      </div>
    );
  } else if (isSuccess && trueSuccess) {
    // persist is true, token is defined
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    // persist is true, token is defined
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  } else {
    content = (
      <div className="min-h-screen bg-navy">
        <NavBar />
        <div className="text-2xl text-center text-white text-bold m-6">
          Something went wrong
        </div>

        <div className="text-xl text-center text-gray text-bold">
          <Link to="/login">Click here to login again</Link>
        </div>
      </div>
    );
  }

  return content;
};

export default PersistLogin;
