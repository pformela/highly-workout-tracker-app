import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Exercises from "./components/Exercises";
import HomePage from "./components/HomePage";
import PageNotFound from "./components/PageNotFound";
import React from "react";
import AuthModal from "./components/AuthModal";
import TrainingHistory from "./components/TrainingHistory";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/history" element={<TrainingHistory />} />
        <Route path="/login" element={<AuthModal isSignUp={false} />} />
        <Route path="/signup" element={<AuthModal isSignUp={true} />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
