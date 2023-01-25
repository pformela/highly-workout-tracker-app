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
import ExerciseForm from "./features/exercises/ExerciseForm";

const App = () => {
  return (
    <Routes>
      <Route element={<PersistLogin />}>
        <Route path="/">
          <Route index element={<StartWorkout add={false} />} />
          <Route path="addTemplate" element={<StartWorkout add={true} />} />
          <Route
            path="/:folderId/:templateId"
            element={<Workout isTemplate={true} />}
          />
        </Route>
        <Route path="/exercises">
          <Route index element={<Exercises />} />
          <Route path="addExercise" element={<ExerciseForm update={false} />} />
          <Route
            path="updateExercise"
            element={<ExerciseForm update={true} />}
          />
        </Route>
        <Route path="/history">
          <Route index element={<TrainingHistory />} />
          <Route
            path="edit/:workoutId"
            element={<Workout isTemplate={false} />}
          />
        </Route>
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
