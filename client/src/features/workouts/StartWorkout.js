import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../../components/NavBar";
import WorkoutTemplates from "./WorkoutTemplates";
import { useGetTemplateFoldersMutation } from "./folders/folderApiSlice";
import { folderActions, selectFolders } from "./folders/folderSlice";
import { selectUsername } from "../user/userSlice";

const StartWorkout = () => {
  const [getFolders, { isLoading }] = useGetTemplateFoldersMutation();
  const [trueSuccess, setTrueSuccess] = useState(false);

  const effectRan = useRef(false);
  const dispatch = useDispatch();

  const templateFolders = useSelector(selectFolders);
  const username = useSelector(selectUsername);

  const getFolderTemplates = async () => {
    console.log("getting folder templates");
    try {
      const result = await getFolders({ username });
      dispatch(folderActions.setFolders(result.data));
      setTrueSuccess(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (templateFolders?.length === 0 || !templateFolders) {
      getFolderTemplates();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-navy min-h-screen">
      <NavBar />
      <h1 className="text-5xl text-bold text-white mt-6 text-center">
        Start Workout
      </h1>
      <WorkoutTemplates />
    </div>
  );
};

export default StartWorkout;
