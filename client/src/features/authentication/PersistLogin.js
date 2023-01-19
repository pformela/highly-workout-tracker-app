import { Outlet, Link, useNavigate, Navigate } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import { useRefreshMutation } from "./authApiSlice";
import usePersist from "../../hooks/usePersist";
import { useSelector, useDispatch } from "react-redux";
import { selectCurrentToken } from "./authSlice";
import { userActions } from "../user/userSlice";
import NavBar from "../../components/NavBar";
import Loading from "../../components/UI/Loading";
import Login from "./Login";

const PersistLogin = () => {
  const [persist, setPersist] = usePersist();
  const token = useSelector(selectCurrentToken);
  const effectRan = useRef(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [trueSuccess, setTrueSuccess] = useState(false);

  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation();

  const verifyRefreshToken = async () => {
    console.log("verify refresh token");
    try {
      const { data } = await refresh();
      const { userId, username, email } = data;
      dispatch(userActions.setUser({ userId, username, email }));
      setTrueSuccess(true);
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
    console.log("no persist");
    content = <Outlet />;
  } else if (isLoading) {
    // persist is true, token is undefined
    console.log("loading");
    content = <Loading />;
  } else if (isError) {
    // persist is true, token is undefined
    console.log(token);
    console.log("error");
    content = <Navigate to="/login" replace={true} />;
  } else if (isSuccess && trueSuccess) {
    // persist is true, token is defined
    console.log("success");
    content = <Outlet />;
  } else if (token && isUninitialized) {
    // persist is true, token is defined
    console.log("token and uninit");
    content = <Outlet />;
  } else {
    content = <Navigate to="/login" replace={true} />;
  }

  return content;
};

export default PersistLogin;
