// import React from "react";
// import { Formik } from "formik";
// import axios from "axios";
// import { useCookies } from "react-cookie";
// import { useNavigate } from "react-router-dom";
// import { authActions } from "./authSlice";
// import { userActions } from "../user/userSlice";
// import { useDispatch } from "react-redux";
// import NavBar from "../../components/NavBar";
// import Button from "../../components/UI/Button";

// const AuthModal = ({ setShowModal, isSignUp }) => {
//   const [cookies, setCookie, removeCookie] = useCookies(null);
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   return (
//     <div className="bg-navy min-h-screen">
//       <NavBar />
//       <Formik
//         initialValues={{
//           email: "",
//           password: "",
//           username: "",
//           confirmPassword: "",
//         }}
//         validate={(values) => {
//           const errors = {};
//           if (!values.email) errors.email = "Email is required";
//           else if (
//             !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
//           ) {
//             errors.email = "Invalid e-mail address.";
//           }

//           if (isSignUp && !values.username)
//             errors.username = "Username is required";
//           else if (
//             isSignUp &&
//             !/^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/i.test(
//               values.username
//             )
//           )
//             errors.username = "Username is invalid";

//           if (!values.password) errors.password = "Password is required";
//           if (
//             !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/i.test(
//               values.password
//             )
//           )
//             errors.password =
//               "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter and one number";

//           if (isSignUp && !values.confirmPassword)
//             errors.confirmPassword = "Confirm password is required";
//           else if (isSignUp && values.password !== values.confirmPassword)
//             errors.confirmPassword = "Passwords do not match";

//           console.log(errors);
//           return errors;
//         }}
//         onSubmit={async (values, { resetForm }) => {
//           const { email, password, username, confirmPassword } = values;
//           const sanitizedEmail = email.toLowerCase();
//           const data = {
//             email: sanitizedEmail,
//             password,
//             username,
//           };
//           if (isSignUp) {
//             data.confirmPassword = confirmPassword;
//           }
//           try {
//             const response = await axios.post(
//               `http://localhost:4000/${isSignUp ? "signup" : "login"}`,
//               data
//             );

//             setCookie("AuthToken", response.data.token, {
//               path: "/",
//               maxAge: 3600,
//             });

//             setCookie("UserId", response.data.userId, {
//               path: "/",
//               maxAge: 3600,
//             });

//             const success = response.status === 201;
//             if (success && isSignUp) {
//               dispatch(
//                 authActions.authSuccess({
//                   token: response.data.token,
//                   userId: response.data.userId,
//                 })
//               );
//               dispatch(
//                 userActions.setUser({
//                   email: data.email,
//                   username: data.username,
//                   userId: response.data.userId,
//                 })
//               );
//               navigate("/home");
//             } else if (success && !isSignUp) {
//               dispatch(
//                 authActions.authSuccess({
//                   token: response.data.token,
//                   userId: response.data.userId,
//                 })
//               );
//               dispatch(
//                 userActions.setUser({
//                   email: response.data.email,
//                   username: response.data.username,
//                   userId: response.data.userId,
//                 })
//               );
//               navigate("/history");
//             }

//             resetForm();
//           } catch (error) {
//             console.log(error.message);
//           }
//         }}
//       >
//         {({
//           values,
//           handleChange,
//           handleSubmit,
//           isSubmitting,
//           errors,
//           touched,
//         }) => (
//           <div className="">
//             <form
//               onSubmit={handleSubmit}
//               className="flex flex-col gap-4 mt-6 justify-center w-min mx-auto p-6"
//             >
//               {isSignUp ? (
//                 <div className="text-silver self-center font-bold text-4xl mb-6">
//                   Sign Up to Highly
//                 </div>
//               ) : (
//                 <div className="text-silver self-center font-bold text-4xl mb-6">
//                   Log In to Highly
//                 </div>
//               )}
//               {errors.email && touched.email && errors.email ? (
//                 <div className="text-red-500">{errors.email}</div>
//               ) : null}
//               <input
//                 className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
//                 type="email"
//                 name="email"
//                 placeholder="Email"
//                 onChange={handleChange}
//                 value={values.email}
//               />
//               {errors.password && touched.password && errors.password ? (
//                 <div className="text-red-500">{errors.password}</div>
//               ) : null}
//               <input
//                 className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
//                 type="password"
//                 name="password"
//                 placeholder="Password"
//                 onChange={handleChange}
//                 value={values.password}
//               />
//               {isSignUp && (
//                 <>
//                   {errors.username && touched.username && errors.username ? (
//                     <div className="text-red-500">{errors.username}</div>
//                   ) : null}
//                   <input
//                     className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
//                     type="text"
//                     name="username"
//                     placeholder="Username"
//                     onChange={handleChange}
//                     value={values.username}
//                   />
//                   {errors.confirmPassword &&
//                   touched.confirmPassword &&
//                   errors.confirmPassword ? (
//                     <div className="text-red-500">{errors.confirmPassword}</div>
//                   ) : null}
//                   <input
//                     className="bg-darkNavy p-2 text-white rounded-xl w-min text-xl"
//                     type="password"
//                     name="confirmPassword"
//                     placeholder="Confirm Password"
//                     onChange={handleChange}
//                     value={values.confirmPassword}
//                   />
//                 </>
//               )}
//               <Button
//                 className="bg-darkNavy w-min text-white font-bold rounded-xl text-xl self-center hover:bg-silver hover:text-darkNavy"
//                 type="submit"
//                 disabled={isSubmitting}
//               >
//                 Submit
//               </Button>
//             </form>
//           </div>
//         )}
//       </Formik>
//     </div>
//   );
// };

// export default AuthModal;
