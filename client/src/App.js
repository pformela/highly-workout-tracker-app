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
import Prefetch from "./features/authentication/Prefetch";
import Layout from "./components/Layout";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Login />} />
        <Route element={<PersistLogin />}>
          <Route element={<Prefetch />}>
            <Route path="exercises">
              <Route index element={<Exercises />} />
            </Route>
            <Route path="history">
              <Route index element={<TrainingHistory />} />
            </Route>
            <Route path="profile">
              <Route index element={<Profile />} />
            </Route>
            <Route path="startWorkout">
              <Route index element={<StartWorkout />} />
            </Route>
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
