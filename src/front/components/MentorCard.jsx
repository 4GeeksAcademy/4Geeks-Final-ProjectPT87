import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from 'react-router-dom';

export default function MentorCard ({ runner, pictureNumber }) {

    const { store, dispatch, fetchRunner, deleteRunner } = useGlobalReducer()

    const createFavorite = async (id) => {
        await fetch(import.meta.env.VITE_BACKEND_URL + "/favorite_runner/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
            body: JSON.stringify({
                runner: runner.id
            })
        });

        dispatch({
            type: "favorite_runner",
            payload: {
                id: runner.id,
                name: runner.name,
                type: "runner"
            }
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
                "Authorization": "Bearer " + localStorage.getItem("token")
            },
        });

        dispatch({
            type: "remove_favorite",
            payload: {
                id: runner.id,
                type: "runner" }
        });
    };

    return (
        <div>
            <div className = "card mt-3 mx-auto w-50 shadow p-3 mb-5 bg-white rounded">
                <div className = "card-body">
                    <h5 className = "card-title">{runner.name}</h5>
                    {/* <p className = "card-text">{runner.phone}</p>
                    <p className = "card-text">{runner.email}</p>
                    <p className = "card-text">{runner.address}</p> */}
                    <p className = "card-text">{runner.years_running}</p>
                    <p className = "card-text">{runner.schedule}</p>
                    <p className = "card-text">{runner.location}</p>
                    <p className = "card-text">{runner.rating}</p>
                    <p className = "card-text">{runner.level}</p>
                </div>
                <div>
                    <Link to = {"/single_runner/" + runner.id + "/" + pictureNumber}>
                        <button className = "btn btn-primary mb-3">View Details</button>
                    </Link>
                <div className="mb-3 ms-2">
                        <button
                            className={`btn ${store.favorites.some(
                                fav => fav.id === runner.id && fav.type === "runner"
                            )
                                ? "btn-danger"
                                : "btn-outline-warning"
                                }`}
                            onClick={() => {
                                const isFavorite = store.favorites.some(
                                    fav => fav.id === runner.id && fav.type === "runner"
                                );

                                if (isFavorite) {
                                    deleteFavorite(runner.id)
                                    // dispatch({
                                    //     type: "remove_favorite",
                                    //     payload: { id: runner.id, type: "runner" }
                                    // });
                                } else {
                                    createFavorite(runner.id)
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
    )
}