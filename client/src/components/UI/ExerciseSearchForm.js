import React from "react";

const ExerciseSearchForm = (props) => {
  const handleSearchFormSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className=" w-min px-10 py-4 border-2 border-solid border-silver rounded-lg">
      <form
        className="flex flex-col justify-center items-center gap-4 w-fit"
        onSubmit={handleSearchFormSubmit}
      >
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="relative w-7 h-7 top-8 left-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>

          <input
            className="w-max pl-8 px-2 py-1 border-2 border-solid border-silver rounded-lg"
            type="text"
            name="exerciseName"
            id="exerciseName"
            placeholder="Exercise Name"
          />
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-col justify-center items-center gap-2">
            <select
              name="exerciseType"
              id="exerciseType"
              placeholder="Any Exercise Type"
            >
              <option value="Any Exercise Type" disabled selected>
                Any Exercise Type
              </option>
              {props.types.map((type, index) => (
                <option value={type} key={`t${index}`}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <select name="exerciseMuscle" id="exerciseMuscle">
              <option value="Any Muscle Group" disabled selected>
                Any Muscle Group
              </option>
              {props.muscle.map((muscle, index) => (
                <option value={muscle} key={`m${index}`}>
                  {muscle}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col justify-center items-center gap-2">
            <select
              name="exerciseDifficulty"
              id="exerciseDifficulty"
              defaultValue="Any Difficulty"
            >
              {props.difficulty.map((difficulty, index) => (
                <option value={difficulty} key={`d${index}`}>
                  {difficulty}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          className="bg-darkNavy text-2xl px-4 py-1 rounded-md font-bold text-darkGray hover:bg-white hover:text-darkNavy"
          type="submit"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default ExerciseSearchForm;
