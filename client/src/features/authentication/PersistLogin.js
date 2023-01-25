import { Outlet, useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import Loading from "../../components/UI/Loading";
import LoginComponent from "./LoginComponent";

const PersistLogin = () => {
  const [persist] = usePersist();
  const [token] = useState(useSelector(selectCurrentToken));
  const effectRan = useRef(false);

  const navigate = useNavigate();
  const location = useLocation();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError }] =
    useRefreshMutation();

  const verifyRefreshToken = async () => {
    try {
      await refresh();
      setTrueSuccess(true);
      navigate(location.pathname, { replace: true });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (effectRan.current || process.env.NODE_ENV === "development") {
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
    content = <Outlet />;
  } else if (isLoading) {
    // persist is true, token is undefined
    content = <Loading />;
  } else if (isError) {
    // persist is true, token is undefined
    content = <LoginComponent />;
  } else if (isSuccess && trueSuccess) {
    // persist is true, token is defined
    content = <Outlet />;
  } else if (token && isUninitialized) {
    // persist is true, token is defined
    content = <Outlet />;
  } else {
    content = <LoginComponent />;
  }

  return content;
};

export default PersistLogin;
