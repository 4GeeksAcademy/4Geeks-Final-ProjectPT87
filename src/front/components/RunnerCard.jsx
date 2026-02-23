import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from 'react-router-dom';
import ProfileCard from "./ProfileCard.jsx";

export default function RunnerCard({ runner, pictureNumber }) {

    const { store, dispatch, fetchRunner, deleteRunner } = useGlobalReducer()

    return (
        <div>
            <div className="card mt-3 mx-auto w-50 shadow p-3 mb-5 bg-white rounded">
                <ProfileCard runner={runner} />
                <div className="card-body">
                    <h5 className="card-title">{runner.name}</h5>
                    <p className="card-text">{runner.phone}</p>
                    <p className="card-text">{runner.email}</p>
                    <p className="card-text">{runner.role}</p>
                </div>
                <div>
                    <Link to={"/single_runner/" + runner.id + "/" + pictureNumber}>
                        <button className="btn btn-primary mb-3">View Details</button>
                    </Link>

                    <Link to={"/messages/" + runner.id}>
                        <button className="btn btn-success mb-3 ms-2">
                            Message
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
}