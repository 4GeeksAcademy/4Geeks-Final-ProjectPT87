import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { fetchRunner } from "../hooks/actions.jsx";
import React, { useState, useEffect } from "react";
import { use } from "react";




const ProfileCard = ({ runner }) => {





  return (
    <div className="container text-center mt-5">
      <img
        src={runner?.image}
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
