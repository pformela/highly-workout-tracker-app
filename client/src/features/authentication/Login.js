import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";
import { Formik } from "formik";
import { userActions } from "../user/userSlice";
import usePersist from "../../hooks/usePersist";
import NavBar from "../../components/NavBar";
import Button from "../../components/UI/Button";

const Login = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  if (isLoading)
    return (
      <div className="bg-navy min-h-screen">
        <NavBar />
        <div className="text-3xl text-white text-center mt-20">Loading...</div>
      </div>
    );

  const handleToggle = () => {
    setPersist(!persist);
  };

  const content = (
    <Formik
      initialValues={{
        email: "",
        password: "",
      }}
      validate={(values) => {
        const errors = {};
        if (!values.email) errors.email = "Email is required";
        if (!values.password) errors.password = "Password is required";
        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const { token, email, username, userId } = await login({
            email: values.email,
            password: values.password,
          }).unwrap();
          dispatch(setCredentials({ token }));
          dispatch(userActions.setUser({ email, username, userId }));

          navigate("/startWorkout");
        } catch (err) {
          if (!err.status) {
            setErrMsg("No server response.");
            // return;
          } else if (err.status === 400) {
            setErrMsg("Missing email or password");
          } else if (err.status === 401) {
            setErrMsg("Unauthorized");
          } else {
            setErrMsg(err.data?.message);
          }
          console.log(err);
        }
        setSubmitting(false);
      }}
    >
      {({ values, handleChange, handleSubmit, isSubmitting, errors }) => (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 mt-6 justify-center w-min mx-auto p-6"
        >
          <h1 className="text-silver self-center font-bold text-4xl mb-6">
            Login
          </h1>
          {errMsg ? <p className="text-red-500">{errMsg}</p> : null}
          {errors.email ? <p className="text-red-500">{errors.email}</p> : null}
          <input
            className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
            type="text"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={values.email}
            ref={emailRef}
          />
          {errors.password ? (
            <p className="text-red-500">{errors.password}</p>
          ) : null}
          <input
            className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            value={values.password}
            ref={passRef}
          />
          <div className="flex flex-row gap-2 self-center">
            <label htmlFor="persist" className="text-white">
              Stay logged in
            </label>
            <input
              type="checkbox"
              name="persist"
              checked={persist}
              onChange={handleToggle}
            />
          </div>
          <Button
            className="bg-darkNavy w-min text-white font-bold rounded-xl text-xl self-center hover:bg-silver hover:text-darkNavy"
            type="submit"
            disabled={isSubmitting}
          >
            Login
          </Button>
          <div className="text-white text-center mt-6">
            <Link to="/signup">Don't have an account? Sign up here.</Link>
          </div>
        </form>
      )}
    </Formik>
  );

  return content;
};

export default Login;
