import { Routes, Route } from "react-router-dom";
import Exercises from "./features/exercises/Exercises";
import PageNotFound from "./components/PageNotFound";
import React from "react";
import TrainingHistory from "./features/history/TrainingHistory";
import Profile from "./features/user/Profile";
import StartWorkout from "./features/workouts/StartWorkout";
import PersistLogin from "./features/authentication/PersistLogin";
import Workout from "./features/workouts/Workout";
import SignUp from "./features/authentication/SignUp";
import LoginComponent from "./features/authentication/LoginComponent";
import SharedWorkout from "./features/workouts/SharedWorkout";

const App = () => {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/">
          <Route index element={<StartWorkout />} />
          <Route path="/:folderId/:templateId" element={<Workout />} />
        </Route>
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/history" element={<TrainingHistory />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
      <Route path="/shared/:username/:workoutId" element={<SharedWorkout />} />
      <Route path="/login" element={<LoginComponent />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

export default App;
