import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import ExerciseSearchForm from "./ExerciseSearchForm";
import FoundExercises from "./FoundExercises";
import { selectAllExercises } from "./exercisesSlice";
import { useSelector, useDispatch } from "react-redux";
import { exerciseActions, fetchExercises } from "./exercisesSlice";

export const TYPES = [
  "Cardio",
  "Olympic_weightlifting",
  "Plyometrics",
  "Powerlifting",
  "Strength",
  "Stretching",
  "Strongman",
];

export const MUSCLE = [
  "Abdominals",
  "Abductors",
  "Adductors",
  "Biceps",
  "Calves",
  "Chest",
  "Forearms",
  "Glutes",
  "Hamstrings",
  "Lats",
  "Lower_back",
  "Middle_back",
  "Neck",
  "Quadriceps",
  "Traps",
  "Triceps",
];

export const DIFFICULTY = ["Beginner", "Intermediate", "Expert"];

const Exercises = () => {
  const exercises = useSelector(selectAllExercises);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (exercises.length === 0) {
      dispatch(fetchExercises());
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-navy">
      <NavBar />
      <h1 className="text-5xl text-bold text-white mt-6 text-center">
        Exercises
      </h1>
      <div>
        <ExerciseSearchForm
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          types={TYPES}
          muscle={MUSCLE}
          difficulty={DIFFICULTY}
        />
        <FoundExercises
          pick={false}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default Exercises;
