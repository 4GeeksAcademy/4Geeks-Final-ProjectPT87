import React, { useState } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from 'react-router-dom';

export default function MentorCard ({ runner, pictureNumber }) {

    const { store, dispatch, fetchRunners, deleteRunner } = useGlobalReducer()

    return (
        <div>
            <div className = "card mt-3 mx-auto w-50 shadow p-3 mb-5 bg-white rounded">
                <div className = "card-body">
                    <h5 className = "card-title">{runner.name}</h5>
                    <p className = "card-text">{runner.phone}</p>
                    <p className = "card-text">{runner.email}</p>
                </div>
                <div>
                    <Link to = {"/single_runner/" + runner.id + "/" + pictureNumber}>
                        <button className = "btn btn-primary mb-3">View Details</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}