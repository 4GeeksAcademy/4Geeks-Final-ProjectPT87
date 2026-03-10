import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MentorCard from "../components/MentorCard.jsx";
import Page11 from "../assets/img/Page11.jpg";
import "../styles/listMentors.css";

export const ListMentors = () => {
  const { store, dispatch, fetchRunner } = useGlobalReducer();
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    fetchRunner();
  }, []);

  useEffect(() => {
    const mentorList = store.runners.filter(
      (runner) => runner.is_mentor === true,
    );
    setMentors(mentorList);
  }, [store.runners]);
  return (
    <div className="list-mentors-hero">
      <div className="list-mentors-container glass-card">
        <h1 className="list-title p-3">Mentor List</h1>

        <div className="mentor-grid">
          {mentors?.length > 0 ? (
            mentors.map((mentor, index) => {
              let pictureNumber = index < 10 ? index : index - 9;
              // console.log("pictureNumber: " + pictureNumber);
              return (
                <MentorCard
                  key={mentor.id}
                  runner={mentor}
                  pictureNumber={pictureNumber}
                />
              );
            })
          ) : (
            <h2>Add Mentor Profile</h2>
          )}
        </div>
        <br />
        <div>
          <Link to="/">
            <button className="nav-btn" style={{ marginBottom: 100 }}>
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};
