import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Exercises from "./components/Exercises";
import HomePage from "./components/HomePage";
import PageNotFound from "./components/PageNotFound";
import React from "react";
import AuthModal from "./components/AuthModal";
import TrainingHistory from "./components/TrainingHistory";
import Profile from "./components/Profile";
import { useSelector } from "react-redux";
import StartWorkout from "./components/StartWorkout";

const App = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route
          path="/history"
          element={
            isAuthenticated ? (
              <TrainingHistory />
            ) : (
              <AuthModal isSignUp={false} />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? <Profile /> : <AuthModal isSignUp={false} />
          }
        />
        <Route
          path="/startWorkout"
          element={
            isAuthenticated ? <StartWorkout /> : <AuthModal isSignUp={false} />
          }
        />
        <Route path="/login" element={<AuthModal isSignUp={false} />} />
        <Route path="/signup" element={<AuthModal isSignUp={true} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
