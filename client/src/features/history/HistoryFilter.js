import React from "react";
import { workoutActions } from "../workouts/workoutSlice";
import { Field, Formik } from "formik";
import { useDispatch } from "react-redux";

const HistoryFilter = () => {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        name: "",
        hours: "",
        checked: "",
      }}
      onSubmit={(values) => {
        const filter = {
          name: values.name,
          hours: values.hours,
          volume:
            values.checked === "anyVolume" || values.checked === ""
              ? "any"
              : values.checked,
        };
        dispatch(workoutActions.filterWorkoutHistory(filter));
      }}
    >
      {({ values, handleChange, handleSubmit, resetForm }) => (
        <form
          onSubmit={handleSubmit}
          className="p-6 mx-auto flex flex-col justify-center items-center gap-4 w-min border-b-2 border-gray border-opacity-50"
        >
          <div className="self-stretch h-min flex flex-row bg-darkNavy px-2 rounded-xl">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="silver"
              className="h-6 w-6 self-center"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              className="pl-1 px-2 py-2 rounded-lg bg-darkNavy text-silver active:outline-none focus:outline-none"
              type="text"
              name="name"
              id="name"
              placeholder="Workout template name"
              value={values.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <select
                name="hours"
                id="time"
                value={values.hours}
                onChange={handleChange}
                className="bg-darkNavy text-gray px-2 py-1 rounded-lg"
              >
                <option key="1" value="">
                  Any training length
                </option>
                <option key="3" value="0">
                  Below 1 hour
                </option>
                <option key="4" value="1">
                  Below 2 hours
                </option>
                <option key="5" value="2">
                  Above 2 hours
                </option>
              </select>
            </div>
            <div className="flex flex-col flex-wrap text-md text-gray bg-darkNavy rounded-xl p-2 w-full self-center p-4">
              <label
                key="6"
                htmlFor="volume0"
                className="flex flex-row self-start text-center"
              >
                <Field
                  type="radio"
                  name="checked"
                  value="anyVolume"
                  className="self-center mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                Any Volume
              </label>

              <label
                key="7"
                htmlFor="volume5000"
                className="flex flex-row self-start text-center"
              >
                <Field
                  type="radio"
                  name="checked"
                  value="0"
                  className="self-center  mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                0-5000 kg
              </label>

              <label
                key="8"
                htmlFor="volume5001-10000"
                className="flex flex-row self-start text-center"
              >
                <Field
                  type="radio"
                  name="checked"
                  value="5000"
                  className="self-center  mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                5001-10000 kg
              </label>

              <label
                key="9"
                htmlFor="volume10000+"
                className="flex flex-row self-start text-center"
              >
                <Field
                  type="radio"
                  name="checked"
                  value="10000"
                  className="self-center  mr-2 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                Above 10000 kg
              </label>
            </div>
          </div>
          <div className="flex flex-row gap-2">
            <button
              className="bg-darkNavy text-2xl px-4 py-1 rounded-md font-bold text-silver hover:bg-white hover:text-darkNavy"
              type="submit"
            >
              Search
            </button>
            <button
              className="bg-darkNavy text-2xl px-4 py-1 rounded-md font-bold text-silver hover:bg-white hover:text-darkNavy"
              type="button"
              onClick={() => {
                dispatch(workoutActions.resetFilters());
                resetForm();
              }}
            >
              Reset filters
            </button>
          </div>
        </form>
      )}
    </Formik>
  );
};

export default HistoryFilter;
