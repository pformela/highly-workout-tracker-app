import React, { useEffect, useState } from "react";
import { selectTemplate } from "./folders/folderSlice";
import { selectWorkout } from "./workoutSlice";
import { selectUsername } from "../../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import WorkoutExerciseTableHeader from "./WorkoutExerciseTableHeader";
import Modal from "../../components/UI/Modal";
import { useParams } from "react-router-dom";
import CancelWorkoutModal from "./CancelWorkoutModal";
import FinishWorkoutModal from "./FinishWorkoutModal";
import ExerciseMoreInfoModal from "../exercises/ExerciseMoreInfoModal";
import {
  useAddWorkoutToHistoryMutation,
  useGetWorkoutsMutation,
} from "./workoutApiSlice";
import axios from "axios";

const Workout = ({ isTemplate }) => {
  const [showCancelWorkoutModal, setShowCancelWorkoutModal] = useState(false);
  const [showFinishWorkoutModal, setShowFinishWorkoutModal] = useState(false);
  const [image, setImage] = useState(null);
  const [showExerciseMoreInfoModal, setShowExerciseMoreInfoModal] =
    useState(false);
  const [exerciseMoreInfo, setExerciseMoreInfo] = useState({});
  const [finishing, setFinishing] = useState(false);
  const { folderId, templateId, workoutId } = useParams();

  const navigate = useNavigate();

  const username = useSelector(selectUsername);

  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (seconds < 59) {
        setSeconds(seconds + 1);
      } else if (minutes < 59) {
        setSeconds(0);
        setMinutes(minutes + 1);
      } else {
        setSeconds(0);
        setMinutes(0);
        setHours(hours + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const template = useSelector((state) =>
    isTemplate
      ? selectTemplate(state, folderId, templateId)
      : selectWorkout(state)
  );

  const [exercises, setExercises] = useState(
    isTemplate
      ? JSON.parse(JSON.stringify(template.exercises))
          .reverse()
          .map((e) => {
            const sets = {};

            for (let i = 0; i < e.sets; i++) {
              sets[i + 1] = {
                reps: e.reps,
                weight: e.weight,
                isDone: false,
              };
            }

            return {
              exerciseName: e.exerciseName,
              instructions: e.exerciseInstructions,
              equipment: e.exerciseEquipment,
              exerciseId: e.exerciseId,
              isDone: false,
              sets,
            };
          })
      : JSON.parse(JSON.stringify(template.exercises)).map((e) => {
          e.isDone = true;
          e.sets.map((set) => {
            set.isDone = true;
          });
          return e;
        })
  );

  const [addWorkoutToHistory] = useAddWorkoutToHistoryMutation();
  const [getWorkouts] = useGetWorkoutsMutation();

  const handleFinishWorkout = async () => {
    const newExercises = JSON.parse(JSON.stringify(exercises));

    const finalExercises = newExercises.map((exercise) => {
      const sets = Object.values(exercise.sets).map((set) => {
        return {
          reps: set.reps ? +set.reps : 0,
          weight: set.weight ? +set.weight : 0,
        };
      });

      delete exercise.isDone;

      return {
        ...exercise,
        sets,
      };
    });

    const workout = {
      username,
      userWeight: 90,
      templateName: template.name,
      exercises: finalExercises,
      duration: isTemplate
        ? {
            hours,
            minutes,
            seconds,
          }
        : template.duration,
    };

    if (isTemplate) {
      try {
        const { data } = await addWorkoutToHistory(workout).unwrap();
        await getWorkouts({ username });
      } catch (err) {
        console.log(err);
      }
    } else {
      console.log("update me plz");
    }

    navigate("/history");
  };
  const handleInputChange = (e, exerciseIndex, setIndex, type) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][type] = e.target.value;
    setExercises(newExercises);
  };

  const handleIsDoneSet = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    const currState = newExercises[exerciseIndex].sets[setIndex].isDone;
    newExercises[exerciseIndex].sets[setIndex].isDone = !currState;
    const currExerciseState = Object.values(
      newExercises[exerciseIndex].sets
    ).every((set) => set.isDone);
    newExercises[exerciseIndex].isDone = currExerciseState;
    setExercises(newExercises);
  };

  if (!template) {
    return (
      <div className="bg-navy min-h-screen">
        <NavBar />
        <div>You don't have access to this content</div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen pb-6">
      {showCancelWorkoutModal && isTemplate && (
        <Modal>
          <CancelWorkoutModal
            onClose={() => {
              setShowCancelWorkoutModal(false);
            }}
          />
        </Modal>
      )}
      {showFinishWorkoutModal && isTemplate && (
        <Modal>
          <FinishWorkoutModal
            onClose={() => {
              setShowFinishWorkoutModal(false);
            }}
            onFinish={handleFinishWorkout}
          />
        </Modal>
      )}
      {showExerciseMoreInfoModal && (
        <Modal>
          <ExerciseMoreInfoModal
            onClose={() => setShowExerciseMoreInfoModal(false)}
            exercise={exerciseMoreInfo}
          />
        </Modal>
      )}
      <NavBar />
      <div className="flex flex-col m-auto w-max border-2 bg-darkNavy border-darkNavy rounded-xl p-4 px-6 mt-6 gap-4">
        <div className="flex flex-row w-full self-center justify-between">
          <h1 className="text-4xl font-bold text-white">{template.name}</h1>
          {isTemplate ? (
            <h1 className="text-4xl font-bold text-white">
              {minutes < 10 ? `0${hours}` : hours}:
              {minutes < 10 ? `0${minutes}` : minutes}:
              {seconds < 10 ? `0${seconds}` : seconds}
            </h1>
          ) : (
            <h1 className="text-4xl font-bold text-white">
              {template.duration.minutes < 10
                ? `0${template.duration.hours}`
                : template.duration.hours}
              :
              {template.duration.minutes < 10
                ? `0${template.duration.minutes}`
                : template.duration.minutes}
              :
              {template.duration.seconds < 10
                ? `0${template.duration.seconds}`
                : template.duration.seconds}
            </h1>
          )}
        </div>
        <form
          className="bg-lighterDarkNavy rounded-xl p-4 w-max m-auto"
          onSubmit={() => {}}
        >
          <WorkoutExerciseTableHeader id="1" />
          <div className="flex flex-col gap-4">
            {exercises.map((exercise, exIndex) => (
              <ul
                className={`flex flex-row w-max m-auto rounded-xl p-4 ${
                  exercise.isDone
                    ? "border-2 border-greenRgba bg-greenRgba2"
                    : "border-2 border-darkNavy"
                }`}
              >
                <div className="flex flex-col justify-between">
                  <li
                    key={`name${exIndex}`}
                    className={`font-bold text-xl w-96 ${
                      exercise.isDone ? "text-white" : "text-gray"
                    }`}
                  >
                    {exercise.exerciseName}
                  </li>
                  <button
                    className="px-4 pb-2 pt-1 w-16 text-center border-2 border-gray text-gray rounded-md"
                    type="button"
                    onClick={() => {
                      setShowExerciseMoreInfoModal(true);
                      setExerciseMoreInfo(exercise);
                    }}
                  >
                    ●●●
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {Object.keys(exercise.sets)
                    .sort()
                    .map((set, index) => {
                      return (
                        <ul
                          className={`flex flex-row p-2 rounded-xl gap-2 ${
                            exercise.sets[set].isDone ? "bg-greenRgba" : ""
                          }`}
                        >
                          <li
                            className={`text-white text-center text-xl font-bold w-12 px-2 py-1 rounded-md ${
                              exercise.sets[set].isDone
                                ? "bg-greenRgba2"
                                : "bg-darkNavy"
                            }`}
                            key={`number${exIndex}${index}`}
                          >
                            {set}
                          </li>
                          <input
                            key={`i_number${exIndex}${index}`}
                            className={`text-center text-xl w-20 font-bold px-2 py-1 rounded-md ${
                              exercise.sets[set].isDone
                                ? "bg-greenRgba2 text-white"
                                : finishing
                                ? "bg-redRgba text-gray"
                                : "bg-darkNavy text-gray"
                            }`}
                            type="number"
                            min="0"
                            value={
                              exercise.sets[set].weight
                                ? exercise.sets[set].weight
                                : 0
                            }
                            onChange={(e) =>
                              handleInputChange(e, exIndex, set, "weight")
                            }
                          />
                          <input
                            key={`i2_number${exIndex}${index}`}
                            className={`text-center text-xl w-16 font-bold px-2 py-1 rounded-md ${
                              exercise.sets[set].isDone
                                ? "bg-greenRgba2 text-white"
                                : finishing
                                ? "bg-redRgba text-gray"
                                : "bg-darkNavy text-gray"
                            }`}
                            type="number"
                            min="0"
                            value={
                              exercise.sets[set].reps
                                ? exercise.sets[set].reps
                                : 0
                            }
                            onChange={(e) =>
                              handleInputChange(e, exIndex, set, "reps")
                            }
                          />
                          <button
                            key={`b_number${exIndex}${index}`}
                            className={`rounded-md border-2 px-2 ${
                              exercise.sets[set].isDone
                                ? "bg-greenRgba border-greenRgba hover:border-white"
                                : "bg-darkNavy border-darkNavy hover:border-white"
                            }`}
                            type="button"
                            onClick={() => {
                              handleIsDoneSet(exIndex, set);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-8 h-8 text-white"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.5 12.75l6 6 9-13.5"
                              />
                            </svg>
                          </button>
                        </ul>
                      );
                    })}
                </div>
              </ul>
            ))}
            {isTemplate && (
              <div className="flex flex-col gap-2 text-white w-max self-center items-center">
                <h1 className="text-xl">
                  Upload a photo to sum up your training
                </h1>
                <input
                  type="file"
                  name="image"
                  onChange={(e) => setImage(e.target.files[0])}
                  className="block w-full text-sm border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-darkNavy border-darkGray placeholder-darkGray"
                />
              </div>
            )}
            <div className="flex flex-row gap-2 justify-center">
              {isTemplate ? (
                <>
                  <button
                    className="bg-red-500 text-white font-bold text-xl rounded-xl px-12 py-2 border-2 border-red-500 hover:border-white"
                    type="button"
                    onClick={() => {
                      setShowCancelWorkoutModal(true);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-500 text-white font-bold text-xl rounded-xl px-12 py-2 border-2 border-blue-500 hover:border-white"
                    type="button"
                    onClick={() => {
                      setShowFinishWorkoutModal(true);
                      setFinishing(true);
                    }}
                  >
                    Finish
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="bg-red-500 text-white font-bold text-xl rounded-xl px-12 py-2 border-2 border-red-500 hover:border-white"
                    type="button"
                    onClick={() => {
                      navigate("/history");
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-green-500 text-white font-bold text-xl rounded-xl px-12 py-2 border-2 border-green-500 hover:border-white"
                    type="button"
                    onClick={() => {
                      setFinishing(true);
                      handleFinishWorkout();
                    }}
                  >
                    Update
                  </button>
                </>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Workout;
