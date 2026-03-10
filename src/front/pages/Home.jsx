import Page3 from "../assets/img/Page3.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

export const Home = () => {
  const { store, dispatch } = useGlobalReducer();

  const token = localStorage.getItem("token");

  // const loadMessage = async () => {
  // try {
  // const backendUrl = import.meta.env.VITE_BACKEND_URL

  // if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

  // const response = await fetch(backendUrl + "/api/hello")
  // const data = await response.json()

  // if (response.ok) dispatch({ type: "set_hello", payload: data.message })

  // return data

  // } catch (error) {
  // if (error.message) throw new Error(
  // Could not fetch the message from the backend. // Please check if the backend is running and the backend port is public.
  // );
  // }

  // }

  // useEffect(() => {
  // loadMessage()
  // }, [])

  // const {store, dispatch, fetchAgenda} = useGlobalReducer();

  // useEffect(() => {
  // fetchAgenda()
  // }, [])

  return (
    <div className="hero-container">
      <img src={Page3} className="hero-img" alt="Runners" />

      <div className="hero-text">
        <div className="hero-glass glass-card">
          <h1>Welcome to Rigo's Running App!</h1>

          <h5>
            Rigo's Running App is a community where you can meet with other
            runners to run together and even ask for mentorship!
          </h5>

          <div className="text-start hero-list">
            <ul>
              <li>Create your runner profile</li>
              <li>View other runner's profiles</li>
              <li>Favorite other runners to run with</li>
              <li>Schedule a time to meet and run</li>
              <li>Become a mentor!</li>
              <li>Seek a mentor!</li>
            </ul>
          </div>

          {token && (
            <div className="hero-buttons">
              <div className="hero-btn-row">
                {/* <Link to="/create_runner">
                  <button className="nav-btn">Create Runner Profile</button>
                </Link> */}
                <Link to="/edit_runner/:theId">
                  <button className="nav-btn">Update Profile</button>
                </Link>

                <Link to="/list_runners">
                  <button className="nav-btn">List Runners</button>
                </Link>

                <Link to="/list_mentors">
                  <button className="nav-btn">List Mentors</button>
                </Link>
              </div>

              {/* <Link to = "/">
                <button className = "nav-btn">Return Home</button>
            </Link> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
