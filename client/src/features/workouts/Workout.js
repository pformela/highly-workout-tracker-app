import React, { useEffect, useState } from "react";
import { workoutActions } from "./workoutSlice";
import { folderActions } from "./folders/folderSlice";
import { selectTemplate } from "./folders/folderSlice";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../../components/NavBar";
import { useParams } from "react-router-dom";
import { Formik } from "formik";

const Workout = () => {
  const { folderId, templateId } = useParams();
  const template = useSelector((state) =>
    selectTemplate(state, folderId, templateId)
  );

  const [exercises, setExercises] = useState(
    JSON.parse(JSON.stringify(template.exercises))
      .reverse()
      .map((e) => {
        const sets = {};

        for (let i = 0; i < e.sets; i++) {
          sets[i + 1] = {
            reps: e.reps,
            weight: e.weight,
          };
        }

        return {
          exerciseName: e.exerciseName,
          exerciseId: e.exerciseId,
          sets,
        };
      })
  );

  console.log(exercises);

  const dispatch = useDispatch();

  console.log("selected template");
  console.log(template);

  if (!template) {
    return (
      <div className="bg-navy min-h-screen">
        <NavBar />
        <div>You don't have access to this content</div>
      </div>
    );
  }

  return (
    <div className="bg-navy min-h-screen">
      <NavBar />
      <div className="flex flex-col m-auto w-4/5 border-2 border-darkNavy rounded-xl p-4 mt-6 gap-4">
        <div className="flex flex-row w-3/5 self-center justify-between">
          <h1 className="text-4xl font-bold text-white">{template.name}</h1>
          <h1 className="text-4xl font-bold text-white">00:00:00</h1>
        </div>
        <form className="bg-darkNavy rounded-xl p-4" onSubmit={() => {}}>
          <ul className="flex flex-row text-white text-xl w-4/5 m-auto mb-6">
            <li className="w-96">Exercise</li>
            <li className="w-24">Reps</li>
            <li className="w-24">Weight</li>
          </ul>
          <div className="flex flex-col gap-4">
            {exercises.map((exercise, exIndex) => (
              <ul className="flex flex-row w-4/5 m-auto">
                <li key={`name${exIndex}`} className="text-white text-xl w-96">
                  {exercise.exerciseName}
                </li>
                <div className="flex flex-col gap-2">
                  {Object.keys(exercise.sets)
                    .sort()
                    .map((set, index) => {
                      return (
                        <div className="flex flex-row">
                          <li
                            key={`reps${exIndex}${index}`}
                            className="text-white text-xl w-24"
                          >
                            {exercise.sets[set].reps}
                          </li>
                          <li
                            key={`reps${exIndex}${index}`}
                            className="text-white text-xl w-24"
                          >
                            {exercise.sets[set].weight}
                          </li>
                        </div>
                      );
                    })}
                </div>
              </ul>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Workout;
