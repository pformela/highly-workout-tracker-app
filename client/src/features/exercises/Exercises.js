import React, { useEffect } from "react";
import NavBar from "../../components/NavBar";
import ExerciseSearchForm from "./ExerciseSearchForm";
import FoundExercises from "./FoundExercises";

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
  useEffect(() => {
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
          types={TYPES}
          muscle={MUSCLE}
          difficulty={DIFFICULTY}
        />
        <FoundExercises pick={false} />
      </div>
    </div>
  );
};

export default Exercises;
