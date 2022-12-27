import React from "react";
import NavBar from "./NavBar";
import ExerciseSearchForm from "./UI/ExerciseSearchForm";
import FoundExercises from "./FoundExercises";

const TYPES = [
  "Cardio",
  "Olympic_weightlifting",
  "Plyometrics",
  "Powerlifting",
  "Strength",
  "Stretching",
  "Strongman",
];

const MUSCLE = [
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

const DIFFICULTY = ["Beginner", "Intermediate", "Expert"];

const Exercises = () => {
  return (
    <div className="min-h-screen bg-navy">
      <NavBar />
      <div>
        <ExerciseSearchForm
          types={TYPES}
          muscle={MUSCLE}
          difficulty={DIFFICULTY}
        />
        <FoundExercises />
      </div>
    </div>
  );
};

export default Exercises;
