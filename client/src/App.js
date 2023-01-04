import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Exercises from "./features/exercises/Exercises";
import HomePage from "./components/HomePage";
import PageNotFound from "./components/PageNotFound";
import React from "react";
import TrainingHistory from "./features/history/TrainingHistory";
import Profile from "./features/user/Profile";
import StartWorkout from "./features/workouts/StartWorkout";
import Login from "./features/authentication/Login";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/history" element={<TrainingHistory />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/startWorkout" element={<StartWorkout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Login />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
