import React, { useRef, useState, useEffect } from "react";
import { Formik } from "formik";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import usePersist from "../../hooks/usePersist";
import NavBar from "../../components/NavBar";
import Button from "../../components/UI/Button";
import { useRegisterMutation } from "./authApiSlice";
import { userActions } from "../user/userSlice";

const SignUp = () => {
  const emailRef = useRef();
  const passRef = useRef();
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  useEffect(() => {
    emailRef.current.focus();
  }, []);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [register, { isLoading }] = useRegisterMutation();

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
        username: "",
        password: "",
        confirmPassword: "",
      }}
      validate={(values) => {
        const errors = {};
        if (!values.email) errors.email = "Email is required";
        else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "Invalid e-mail address.";
        }

        if (!values.username) errors.username = "Username is required";
        else if (
          !/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/i.test(
            values.username
          )
        )
          errors.username = "Username is invalid";

        if (!values.password) errors.password = "Password is required";
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i.test(
            values.password
          )
        )
          errors.password =
            "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number";

        if (!values.confirmPassword)
          errors.confirmPassword = "Confirm password is required";
        else if (values.password !== values.confirmPassword)
          errors.confirmPassword = "Passwords do not match";

        return errors;
      }}
      onSubmit={async (values, { setSubmitting }) => {
        try {
          const { token, username, userId, email } = await register({
            email: values.email,
            password: values.password,
            username: values.username,
          }).unwrap();
          dispatch(setCredentials({ token }));
          dispatch(userActions.setUser({ username, userId, email }));
          navigate("/");
        } catch (err) {
          if (!err.status) {
            setErrMsg("No server response.");
          } else if (err.status === 400) {
            setErrMsg("Missing email or password");
          } else if (err.status === 401) {
            setErrMsg("Unauthorized");
          } else {
            setErrMsg(err.data?.message);
          }
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
            Sign Up to Highly
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
          {errors.username ? (
            <p className="text-red-500">{errors.username}</p>
          ) : null}
          <input
            className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
            type="text"
            name="username"
            placeholder="Username"
            onChange={handleChange}
            value={values.username}
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
          {errors.confirmPassword ? (
            <p className="text-red-500">{errors.confirmPassword}</p>
          ) : null}
          <input
            className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            onChange={handleChange}
            value={values.confirmPassword}
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
            className="bg-darkNavy w-content text-white font-bold rounded-xl text-xl self-center hover:bg-silver hover:text-darkNavy"
            type="submit"
            disabled={isSubmitting}
          >
            Sign Up
          </Button>
          <div className="text-white text-center mt-6">
            <Link to="/login">Already have an account? Login here.</Link>
          </div>
        </form>
      )}
    </Formik>
  );

  return (
    <div className="bg-navy min-h-screen">
      <NavBar />
      {content}
    </div>
  );
};

export default SignUp;
