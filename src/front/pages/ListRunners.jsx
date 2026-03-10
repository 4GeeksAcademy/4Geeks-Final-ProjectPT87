import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import RunnerCard from "../components/RunnerCard.jsx";
import Spinner from "../components/Spinner.jsx";
import ProfileCard from "../components/ProfileCard.jsx";
import Page9 from "../assets/img/Page9.jpg";
import "../styles/listRunners.css";

// This page lists all of the runner cards so that users can scroll through
export const ListRunners = ({ runner }) => {

    const { store, dispatch, fetchRunner } = useGlobalReducer();
    const [runners, setRunners] = useState([]);
    const [loading, setLoading] = useState(true);

    // Loading useEffect
    useEffect(() => {
        const fetchData = async () => {
            await fetchRunner(dispatch);
            setLoading(false);
        };

        fetchData();
    }, []);

    // useEffect(() => {
    //     fetchRunner()
    //     setRunners(store.runners)
    // }, [])
  useEffect(() => {
    setRunners(store.runners);
  }, [store.runners]);

  // Loading component
    if (loading) return <Spinner />;
  return (
  <div className="list-runners-hero">

    <div className="list-runners-container glass-card">

      <h1 className="list-title">Runner List</h1>

      <div className="runner-grid">
        {runners?.length > 0 ? (
          runners.map((runner, index) => {
            let pictureNumber = index < 10 ? index : index - 9;
            // console.log("pictureNumber: " + pictureNumber);
            return (
              <RunnerCard
                key={runner.id}
                runner={runner}
                pictureNumber={pictureNumber}
              />
            );
          })
        ) : (
          <h2>Add Runner Profile</h2>
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
