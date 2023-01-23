import React, { useEffect, useState } from "react";
import NavBar from "../../components/NavBar";
import ExerciseSearchForm from "./ExerciseSearchForm";
import FoundExercises from "./FoundExercises";
import { selectAllExercises } from "./exercisesSlice";
import { useSelector, useDispatch } from "react-redux";
import { fetchExercises } from "./exercisesSlice";

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

const Exercises = ({ pick, onSelect }) => {
  const exercises = useSelector(selectAllExercises);
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  useEffect(() => {
    if (exercises.length === 0) {
      dispatch(fetchExercises());
    }
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  return (
    <div className={`bg-navy ${pick ? "h-min" : "min-h-screen"}`}>
      {!pick && (
        <>
          <NavBar />
          <h1 className="text-5xl text-bold text-white mt-6 text-center">
            Exercises
          </h1>
        </>
      )}
      <div>
        <ExerciseSearchForm
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          types={TYPES}
          muscle={MUSCLE}
          difficulty={DIFFICULTY}
        />
        <FoundExercises
          pick={pick}
          setCurrentPage={setCurrentPage}
          onSelect={onSelect}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default Exercises;
