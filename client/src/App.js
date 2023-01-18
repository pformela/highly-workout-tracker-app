import { Routes, Route } from "react-router-dom";
import Exercises from "./features/exercises/Exercises";
import HomePage from "./components/HomePage";
import PageNotFound from "./components/PageNotFound";
import React from "react";
import TrainingHistory from "./features/history/TrainingHistory";
import Profile from "./features/user/Profile";
import StartWorkout from "./features/workouts/StartWorkout";
import Login from "./features/authentication/Login";
import PersistLogin from "./features/authentication/PersistLogin";
import Workout from "./features/workouts/Workout";
import Prefetch from "./features/authentication/Prefetch";
import Layout from "./components/Layout";
import SignUp from "./features/authentication/SignUp";
import LoginComponent from "./features/authentication/LoginComponent";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PersistLogin />}>
        {/* <Route element={<Prefetch />}> */}
        <Route path="exercises" element={<Exercises />} />
        <Route path="history" element={<TrainingHistory />} />
        <Route path="profile" element={<Profile />} />
        <Route path="startWorkout">
          <Route index element={<StartWorkout />} />
          <Route path=":folderId/:templateId" element={<Workout />} />
        </Route>
        {/* </Route> */}
      </Route>
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
