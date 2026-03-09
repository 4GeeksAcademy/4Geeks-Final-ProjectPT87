// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom"; // To use link for navigation and useParams to get URL parameters
import PropTypes from "prop-types"; // To define prop types for this component
import useGlobalReducer from "../hooks/useGlobalReducer"; // Import a custom hook for accessing the global state
import React, { useState, useEffect } from "react";
import Page12 from "../assets/img/Page12.jpg";
import "../styles/singleRunner.css";
// import ProfileCard from "../components/ProfileCard";
// import pictureNumber from "./ListUsers";

// Define and export the Single component which displays individual item details.
export const SingleRunner = (props) => {
  // Access the global state using the custom hook.
  const { store, dispatch, fetchRunner, editRunner, deleteRunner } =
    useGlobalReducer();
  const [runner, setRunner] = useState({});
  // Retrieve the 'theId' URL parameter using useParams hook.
  const { theId, pictureNumber } = useParams();

  useEffect(() => {
    const singleRunner = store.runners.find(
      (runner) => runner.id === parseInt(theId),
    );
    if (singleRunner) {
      setRunner(singleRunner);
    } else {
      fetchRunner()
        .then((foundRunners) => {
          const foundRunner = foundRunners.find(
            (runner) => runner.id === parseInt(theId),
          );
          return foundRunner;
        })
        .then((foundRunner) => {
          setRunner(foundRunner);
        });
    }
  }, [store.runners]);

  // let pictureNumber = index < 10 ? index : index - 9;
  // console.log(pictureNumber);
  let currentUrl = window.location.href.split("/single_runner")[0];
  let pictureUrl =
    currentUrl + "/src/assets/img/profile-" + pictureNumber + ".jpg";

  return (
    <div className="single-runner-hero">
      <div className="single-runner-card">
        {/* Display the title of the runner element dynamically retrieved from the store using theId. */}
        <div className="profile-title text-center">
          <h1>Runner Profile</h1>
        </div>
        <div className="profile-image-container text-center">
          <img
            src="https://i.pravatar.cc/250/250"
            alt="User profile"
            className="profile-image"
          />

          {/* <h2>Runner Name</h2> */}
          {/* <p className="text-muted">Runner</p>
        <p>Welcome to your profile page.</p> */}
        </div>
        {/* <ProfileCard /> */}
        <div className="runner-details mt-4">
          <h4>Name: {runner?.name}</h4>
          <h4>Phone: {runner?.phone}</h4>
          <h4>Email: {runner?.email}</h4>
          <h4>Address: {runner?.address}</h4>
          <h4>Years Running: {runner?.years_running}</h4>
          <h4>Running Schedule: {runner?.schedule}</h4>
          <h4>Location: {runner?.location}</h4>
          <h4>Rating: {runner?.rating}</h4>
          <h4>Level: {runner?.level}</h4>
          <h4>Is Mentor?: {runner?.is_mentor ? "Yes" : "No"}</h4>
        </div>
        <hr className="my-4" /> {/* A horizontal rule for visual separation. */}
        {/* A Link component acts as an anchor tag but is used for client-side routing to prevent page reloads. */}
        <div className="runner-buttons">
          {/* <Link to = {"/edit_runner/" + runner.id}>
          <button className="nav-btn" href="#" role="button">
            Edit Runner Profile
          </button>
        </Link> */}

          {/* <Link to="/list_runners">
          <button 
            className="nav-btn" 
            href="#" 
            role="button"
            onClick={() => deleteRunner(runner.id)}
            >
              Delete Runner Profile
          </button>
        </Link> */}

          <Link to="/list_runners">
            <button className="nav-btn">List Runners</button>
          </Link>

          <Link to="/list_mentors">
            <button className="nav-btn">List Mentors</button>
          </Link>

          <Link to="/">
            <button className="nav-btn">Return Home</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Use PropTypes to validate the props passed to this component, ensuring reliable behavior.
SingleRunner.propTypes = {
  // Although 'match' prop is defined here, it is not used in the component.
  // Consider removing or using it as needed.
  match: PropTypes.object,
};
