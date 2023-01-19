import React from "react";
import { useSelector } from "react-redux";
import NavBar from "../../components/NavBar";

const Profile = () => {
  const { username, email } = useSelector((state) => state.user);

  return (
    <div className="min-h-screen bg-navy">
      <NavBar />
      <div>
        <h1 className="text-5xl text-bold text-white mt-6 text-center">
          Profile
        </h1>
        <div className="flex flex-col items-center">
          <div className="flex flex-col items-start mt-10">
            <div className="text-2xl text-white">Username: {username}</div>
            <div className="text-2xl text-white">Email: {email}</div>

            <button
              className="bg-red-500 text-white text-xl rounded-xl p-2 mt-4 self-center"
              onClick={() => {}}
              disabled={true}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
