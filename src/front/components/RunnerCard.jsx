import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import { fetchFavorites } from "../hooks/actions.js";
// import ProfileCard from "./ProfileCard.jsx";

// This card populates the runners on the List Runners page
// This allows users to scroll through the runners to see who to favorite
export default function RunnerCard({ runner, pictureNumber }) {
  const { store, dispatch, fetchRunner, deleteRunner, fetchFavorites } =
    useGlobalReducer();

  const createFavorite = async (id) => {
    await fetch(import.meta.env.VITE_BACKEND_URL + "/favorite_runner/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        runner: runner.id,
      }),
    });

    fetchFavorites();
    // dispatch({
    //     type: "favorite_runner",
    //     payload: {
    //         id: runner.id,
    //         name: runner.name,
    //         type: "runner"
    //     }
    // });
    // dispatch({
    //     type: "favorite_runner",
    //     payload: { id: runner.id, type: "runner" }
    // });
  };

  const deleteFavorite = async (id) => {
    await fetch(import.meta.env.VITE_BACKEND_URL + "/favorite_runner/" + id, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    fetchFavorites();
    // dispatch({
    //     type: "remove_favorite",
    //     payload: {
    //         id: runner.id,
    //         type: "runner" }
    // });
  };

  return (
    <div>
      <div className="runner-card glass-card">
        <div className="card-body">
          <div className="container text-center mt-5">
            <img
              // {runner?.length > 0 ? runner.map((runner, index) => {
              //     let pictureNumber = index < 7 ? index : index - 6;
              //         // console.log("pictureNumber: " + pictureNumber);
              //     return (
              //         key = {runner.id}
              //         runner = {runner}
              //         pictureNumber={pictureNumber}
              //     )
              src={`https://i.pravatar.cc/250?img=${pictureNumber}`}
              alt="User profile"
              className="rounded-circle mx-auto d-block mb-3"
            />
            {/* <h2>Runner Name</h2> */}
            {/* <p className="text-muted">Runner</p> */}
            {/* <p>Welcome to your profile page.</p> */}
          </div>
          <h5 className="card-title">{runner.name}</h5>
          {/* <p className = "card-text">{runner.phone}</p>
                    <p className = "card-text">{runner.email}</p>
                    <p className = "card-text">{runner.address}</p> */}
          <p className="card-text">Years Running: {runner.years_running}</p>
          <p className="card-text">Schedule: {runner.schedule}</p>
          <p className="card-text">Location: {runner.location}</p>
          <p className="card-text">Runner Rating: {runner.rating}</p>
          <p className="card-text">Running Level: {runner.level}</p>
        </div>
        <div className="d-flex justify-content-center">
          <Link to={"/single_runner/" + runner.id + "/" + pictureNumber}>
            <button className="nav-btn mb-3">View Details</button>
          </Link>

          <Link to={"/messages/" + runner.id}>
            <button className="nav-btn mb-3 ms-2">Message</button>
          </Link>

          {/* Favorite functionality */}
          {/* <i 
                    className={store.favorites?.some(element => element.name === props.name) ? "mx-2 fa-solid fa-heart" : "mx-2 fa-regular fa-heart"}
                    onClick = { () => toggleFavorites()}>
                    </i> */}
          <div className="mb-3 ms-2">
            <button
              className={`nav-btn heart-btn ${
                store?.favorites.some((fav) => fav.runner.id === runner.id)
                  ? "favorited"
                  : ""
              }`}
              onClick={() => {
                const isFavorite = store?.favorites.some(
                  (fav) => fav.runner.id === runner.id,
                );

                if (isFavorite) {
                  deleteFavorite(runner.id);
                  // dispatch({
                  //     type: "remove_favorite",
                  //     payload: { id: runner.id, type: "runner" }
                  // });
                } else {
                  createFavorite(runner.id);
                  // dispatch({
                  //     type: "favorite_runner",
                  //     payload: {
                  //         id: runner.id,
                  //         name: runner.name,
                  //         type: "runner"
                  //     }
                  // });
                }
              }}
            >
              <i className="fa-solid fa-heart"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
