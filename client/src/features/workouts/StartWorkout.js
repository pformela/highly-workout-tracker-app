import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import NavBar from "../../components/NavBar";
import WorkoutTemplates from "./WorkoutTemplates";
import { useGetTemplateFoldersMutation } from "./folders/folderApiSlice";
import { folderActions, selectFolders } from "./folders/folderSlice";
import { selectUsername } from "../user/userSlice";

const StartWorkout = ({ add }) => {
  const [getFolders] = useGetTemplateFoldersMutation();

  const dispatch = useDispatch();

  const templateFolders = useSelector(selectFolders);
  const username = useSelector(selectUsername);

  const getFolderTemplates = async () => {
    try {
      const result = await getFolders({ username });
      dispatch(folderActions.setFolders(result.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (templateFolders?.length === 0 || !templateFolders) {
      getFolderTemplates();
    }
    window.scrollTo(0, 0);
    // eslint-disable-next-line
  }, []);

  return (
    <div className="bg-navy min-h-screen pb-16">
      <NavBar />
      <h1 className="text-5xl text-bold text-white mt-6 text-center">
        Start Workout
      </h1>
      <WorkoutTemplates add={add} />
    </div>
  );
};

export default StartWorkout;
