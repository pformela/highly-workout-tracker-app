import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectUsername } from "../user/userSlice";
import Modal from "../../components/UI/Modal";
import DeleteWorkoutModal from "./DeleteWorkoutModal";
import { workoutActions } from "../workouts/workoutSlice";
import { useDeleteWorkoutMutation } from "../workouts/workoutApiSlice";
import ShareWorkoutModal from "./ShareWorkoutModal";

const Training = ({ workout, workoutId, index }) => {
  const [showDeleteWorkoutModal, setShowDeleteWorkoutModal] = useState(false);
  const [showShareWorkoutModal, setShowShareWorkoutModal] = useState(false);
  const navigate = useNavigate();

  const [deleteWorkout] = useDeleteWorkoutMutation();
  const dispatch = useDispatch();

  const username = useSelector(selectUsername);

  const handleDelete = async () => {
    try {
      console.log(workoutId);
      await deleteWorkout({ workoutId });
    } catch (err) {
      console.log(err);
    }

    setShowDeleteWorkoutModal(false);
  };

  const prepareForUpdate = () => {
    const newWorkout = {
      workoutId: workout.workoutId,
      name: workout.templateName,
      duration: workout.duration,
      exercises: Object.keys(workout.exercises).map((key) => {
        return {
          exerciseId: key,
          instructions: workout.exercises[key].exerciseInstructions,
          exerciseEquipment: workout.exercises[key].exerciseEquipment,
          exerciseName: workout.exercises[key].exerciseName,
          sets: workout.exercises[key].sets,
        };
      }),
    };

    dispatch(workoutActions.setCurrentWorkoutTemplate(newWorkout));
  };

  const dropdownContent = (
    <div className="">
      <select
        className="bg-navy rounded-md px-2 py-1 text-gray active:text-white"
        onChange={(e) => {
          if (e.target.value === "Edit workout") {
            prepareForUpdate();
            navigate(`/history/edit/${workoutId}`);
          } else if (e.target.value === "Share workout") {
            setShowShareWorkoutModal(true);
          } else if (e.target.value === "Delete workout") {
            setShowDeleteWorkoutModal(true);
          }
        }}
      >
        <option isdisabled="true">Select an action</option>
        <option>Edit workout</option>
        <option>Share workout</option>
        <option>Delete workout</option>
      </select>
    </div>
  );

  return (
    <>
      {showDeleteWorkoutModal && (
        <Modal>
          <DeleteWorkoutModal
            onClose={() => setShowDeleteWorkoutModal(false)}
            onDelete={() => handleDelete()}
          />
        </Modal>
      )}
      {showShareWorkoutModal && (
        <Modal>
          <ShareWorkoutModal
            username={username}
            workoutId={workoutId}
            onClose={() => setShowShareWorkoutModal(false)}
          />
        </Modal>
      )}
      <div className="flex flex-row justify-between">
        <h1 className="text-white font-bold text-xl self-center">
          {workout.templateName}
        </h1>
        {dropdownContent}
      </div>
      <div className="text-darkGray text-xl">{workout.formattedDate}</div>
      <div className="flex flex-row">
        <div className="w-1/3 flex gap-2 flex-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-darkGray self-center"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-darkGray text-xl text-center">
            {workout.duration.hours > 0 ? `${workout.duration.hours}h ` : ""}
            {workout.duration.minutes}m
          </span>
        </div>
        <div className="w-1/3 flex gap-2 flex-row">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6 text-darkGray self-center"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z"
            />
          </svg>
          <span className="text-darkGray text-xl text-center">
            {workout.volume}kg
          </span>
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="flex flex-col w-full w-2/3 self-center">
          <div className="flex flex-row">
            <h3 className="w-2/3 text-white text-xl font-bold">Exercise</h3>
            <h3 className="w-1/3 text-white text-xl font-bold">Best Set</h3>
          </div>
          {Object.keys(workout.exercises).map((exercise, index) => {
            return (
              <div
                key={`ex${workoutId}${index}`}
                className="flex flex-row gap-2 text-darkGray w-full"
              >
                <div className="w-2/3 truncate">
                  {Object.keys(workout.exercises[exercise].sets).length} x{" "}
                  {workout.exercises[exercise].exerciseName}
                </div>
                <div className="w-1/3">
                  {workout.exercises[exercise].bestSet.weight} kg x{" "}
                  {workout.exercises[exercise].bestSet.reps}
                </div>
              </div>
            );
          })}
        </div>
        <div className="w-1/3 h-full self-center p-2 bg-lighterDarkNavy rounded-xl">
          {!workout.imageUrl ? (
            <img
              src="https://images.unsplash.com/photo-1528720208104-3d9bd03cc9d4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80"
              alt="workoutImage"
              className="self-center w-48 m-auto rounded-xl"
            />
          ) : (
            <img
              src={workout.imageUrl}
              alt="chevron"
              className="self-center w-48 m-auto rounded-xl"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default Training;
