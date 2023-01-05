import { Outlet, Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";

const PersistLogin = () => {
  const [persist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV === "development") {
      const verifyRefreshToken = async () => {
        console.log("verify refresh token");
        try {
          const response = await refresh();
          const { token } = response.data;
          console.log("refresh token: " + token);
          setTrueSuccess(true);
        } catch (err) {
          console.log(err);
        }
        if (!token && persist) verifyRefreshToken();
      };
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
      <div>
        {error.message}
        <Link to="/login">Please login again</Link>
      </div>
    );
  } else if (isSuccess && trueSuccess) {
    // persist is true, token is defined
    console.log("success");
    content = <Outlet />;
  } else if (token & isUninitialized) {
    // persist is true, token is defined
    console.log("token and uninit");
    console.log(isUninitialized);
    content = <Outlet />;
  }

  return content;
};

export default PersistLogin;
