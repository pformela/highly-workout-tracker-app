import React, { useState } from "react";
import { TYPES, MUSCLE, DIFFICULTY } from "./Exercises";
import { useDeleteExerciseMutation } from "./exerciseApiSlice";
import { useDispatch } from "react-redux";
import { exerciseActions } from "./exercisesSlice";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/UI/Modal";
import abdominals from "../../images/muscle_groups/abdominals.png";
import calves from "../../images/muscle_groups/calves.png";
import chest from "../../images/muscle_groups/chest.png";
import forearms from "../../images/muscle_groups/forearms.png";
import glutes from "../../images/muscle_groups/glutes.png";
import hamstrings from "../../images/muscle_groups/hamstrings.png";
import lats from "../../images/muscle_groups/lats.png";
import lower_middle_back from "../../images/muscle_groups/lower_middle_back.png";
import neck from "../../images/muscle_groups/neck.png";
import quadriceps from "../../images/muscle_groups/quadriceps.png";
import traps from "../../images/muscle_groups/traps.png";
import triceps from "../../images/muscle_groups/triceps.png";
import biceps from "../../images/muscle_groups/biceps.png";
import no_muscle from "../../images/muscle_groups/no_muscle.png";

const MUSCLE_IMAGES = {
  Abdominals: abdominals,
  Abductors: quadriceps,
  Adductors: quadriceps,
  Biceps: biceps,
  Calves: calves,
  Chest: chest,
  Forearms: forearms,
  Glutes: glutes,
  Hamstrings: hamstrings,
  Lats: lats,
  Lower_back: lower_middle_back,
  Middle_back: lower_middle_back,
  Neck: neck,
  Quadriceps: quadriceps,
  Traps: traps,
  Triceps: triceps,
  NoMuscle: no_muscle,
};

const Exercise = ({ exercise }) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const labels = exercise.labels.filter((label) => label !== "Exercise");
  const type = labels.find((label) => TYPES.includes(label));
  const muscle = labels.find((label) => MUSCLE.includes(label));
  const difficulty = labels.find((label) => DIFFICULTY.includes(label));

  const [deleteExercise] = useDeleteExerciseMutation();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await deleteExercise({ exerciseId: exercise.exerciseId });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-row gap-4 bg-darkNavy rounded-xl text-white px-6 py-4">
      {showDeleteModal && (
        <Modal>
          <div className="flex flex-col gap-4 text-center">
            <h3 className="text-xl font-bold text-4xl">Delete Exercise</h3>
            <p className="text-xl">
              Are you sure you want to delete this exercise?
            </p>
            <div className="flex flex-row gap-2 self-center">
              <button
                className="px-4 py-1 rounded-md bg-red-500 border-2 border-red-500 hover:border-white font-bold text-white"
                onClick={() => {
                  handleDelete();
                  setShowDeleteModal(false);
                }}
              >
                Delete
              </button>
              <button
                className="px-4 py-1 rounded-md bg-blue-500 border-2 border-blue-500 hover:border-white font-bold text-white"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      <div className="flex flex-col gap-2 w-full">
        <h3 className="text-xl font-bold">{exercise.name}</h3>
        {!showMoreInfo ? (
          <p>
            {exercise.instructions.length > 200
              ? exercise.instructions.substring(0, 200) + "..."
              : exercise.instructions}
          </p>
        ) : (
          <>
            <p>{exercise.instructions}</p>
            <p className="font-bold">
              Equipment:{" "}
              <span className="font-normal">{exercise.equipment}</span>
            </p>
          </>
        )}
        <div className="flex flex-row gap-2">
          {type && (
            <span
              key={`t${exercise.exerciseId}`}
              className="bg-gradient-to-r from-pink-500 to-yellow-500 p-1 rounded-md"
            >
              {type}
            </span>
          )}
          {muscle && (
            <span
              key={`m${exercise.exerciseId}`}
              className="bg-gradient-to-r from-green-400 to-blue-500 p-1 rounded-md"
            >
              {muscle}
            </span>
          )}
          {difficulty && (
            <span
              key={`d${exercise.exerciseId}`}
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-md"
            >
              {difficulty}
            </span>
          )}
        </div>
        <div className="flex flex-row self-end gap-2 mt-4">
          <button
            className="px-4 py-1 rounded-md bg-gray border-2 border-gray hover:border-white font-bold text-white"
            onClick={() => setShowMoreInfo((prev) => !prev)}
          >
            Show more info
          </button>
          <button
            className="px-4 py-1 rounded-md bg-blue-500 border-2 border-blue-500 hover:border-white font-bold text-white"
            onClick={() => {
              dispatch(exerciseActions.selectCurrentUpdateExercise(exercise));
              navigate("/exercises/updateExercise");
            }}
          >
            Update
          </button>
          <button
            className="px-4 py-1 rounded-md bg-red-500 border-2 border-red-500 hover:border-white font-bold text-white"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="flex flex-col bg-lighterDarkNavy rounded-xl w-max h-full self-start">
        {muscle ? (
          <img src={MUSCLE_IMAGES[muscle]} alt={muscle} className="w-40" />
        ) : (
          <img
            src={MUSCLE_IMAGES["NoMuscle"]}
            alt="No muscle"
            className="w-40"
          />
        )}
      </div>
    </div>
  );
};

export default Exercise;
