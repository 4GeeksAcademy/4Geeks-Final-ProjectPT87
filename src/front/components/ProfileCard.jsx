import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { fetchRunner } from "../hooks/actions.jsx";
import React, { useState, useEffect } from "react";
import { use } from "react";
const ProfileCard = () => {





  return (
    <div className="container text-center mt-5">
      <img
        src="https://i.pravatar.cc/250/250"
        alt="User profile"
        className="rounded-circle mx-auto d-block mb-3"
      />
       {/* <h2>Runner Name</h2> */}
      <p className="text-muted">Runner</p>
      <p>Welcome to your profile page.</p>
    </div>
  );
};

export default ProfileCard;
