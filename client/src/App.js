import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Exercises from "./components/Exercises";
import HomePage from "./components/HomePage";
import PageNotFound from "./components/PageNotFound";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
