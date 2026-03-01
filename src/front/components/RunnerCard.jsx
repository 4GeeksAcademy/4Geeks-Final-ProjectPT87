import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from 'react-router-dom';
// import ProfileCard from "./ProfileCard.jsx";

// This card populates the runners on the List Runners page
// This allows users to scroll through the runners to see who to favorite
export default function RunnerCard ({ runner, pictureNumber }) {

    const { store, dispatch, fetchRunner, deleteRunner } = useGlobalReducer()

    return (
        <div>
            <div className = "card mt-3 mx-auto w-50 shadow p-3 mb-5 bg-white rounded">
                <div className = "card-body">
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
                            src="https://i.pravatar.cc/250/250"
                            alt="User profile"
                            className="rounded-circle mx-auto d-block mb-3"
                        />
                        {/* <h2>Runner Name</h2> */}
                        {/* <p className="text-muted">Runner</p> */}
                        {/* <p>Welcome to your profile page.</p> */}
                    </div>
                    <h5 className = "card-title">{runner.name}</h5>
                    {/* <p className = "card-text">{runner.phone}</p>
                    <p className = "card-text">{runner.email}</p>
                    <p className = "card-text">{runner.address}</p> */}
                    <p className = "card-text">{runner.years_running}</p>
                    <p className = "card-text">{runner.schedule}</p>
                    <p className = "card-text">{runner.location}</p>
                </div>
                <div className = "d-flex justify-content-center">
                    <Link to={"/single_runner/" + runner.id + "/" + pictureNumber}>
                        <button className="btn btn-primary mb-3">View Details</button>
                    </Link>

                    <Link to={"/messages/" + runner.id}>
                        <button className="btn btn-success mb-3 ms-2">
                            Message
                        </button>
                    </Link>

                    {/* Favorite functionality */}
                    {/* <i 
                    className={store.favorites?.some(element => element.name === props.name) ? "mx-2 fa-solid fa-heart" : "mx-2 fa-regular fa-heart"}
                    onClick = { () => toggleFavorites()}>
                    </i> */}
                    <div className = "mb-3 ms-2">
                        <button 
                            className = {`btn ${store.favorites.some(
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
                                    dispatch({
                                        type: "remove_favorite",
                                        payload: { id: runner.id, type: "runner" }
                                    });
                                } else {
                                    dispatch({
                                        type: "favorite_runner",
                                        payload: {
                                            id: runner.id,
                                            name: runner.name,
                                            type: "runner"
                                        }
                                    });
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