import React from "react";
import { Route, redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthenticatedRoute = ({ element }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const redirectToLogin = () => {
    redirect("/login");
  };

  return (
    <Route
      render={(props) => (isAuthenticated ? { element } : { redirectToLogin })}
    />
  );
};

export default AuthenticatedRoute;
