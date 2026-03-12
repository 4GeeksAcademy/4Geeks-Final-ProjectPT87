import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";

export default function MentorCard({ runner, pictureNumber }) {
  const { store, dispatch, fetchRunner, deleteRunner } = useGlobalReducer();

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

    dispatch({
      type: "favorite_runner",
      payload: {
        id: runner.id,
        name: runner.name,
        type: "runner",
      },
    });
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

    dispatch({
      type: "remove_favorite",
      payload: {
        id: runner.id,
        type: "runner",
      },
    });
  };

  return (
    <div>
      <div className="runner-card glass-card">
        <div className="card-body">
          <div className="container text-center mt-4">
            <img
              src={`https://i.pravatar.cc/250?img=${pictureNumber}`}
              alt="User profile"
              className="rounded-circle mx-auto d-block mb-3"
            />
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

          <div className="mb-3 ms-2">
            <button
              className={`btn ${
                store.favorites.some(
                  (fav) => fav.id === runner.id && fav.type === "runner",
                )
                  ? "btn-danger"
                  : "btn-outline-warning"
              }`}
              onClick={() => {
                const isFavorite = store.favorites.some(
                  (fav) => fav.id === runner.id && fav.type === "runner",
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
              ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
