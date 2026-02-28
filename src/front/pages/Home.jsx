import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Home = () => {

	const { store, dispatch } = useGlobalReducer()

	// const loadMessage = async () => {
	// 	try {
	// 		const backendUrl = import.meta.env.VITE_BACKEND_URL

	// 		if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file")

	// 		const response = await fetch(backendUrl + "/api/hello")
	// 		const data = await response.json()

	// 		if (response.ok) dispatch({ type: "set_hello", payload: data.message })

	// 		return data

	// 	} catch (error) {
	// 		if (error.message) throw new Error(
	// 			`Could not fetch the message from the backend.
	// 			Please check if the backend is running and the backend port is public.`
	// 		);
	// 	}

	// }

	// useEffect(() => {
	// 	loadMessage()
	// }, [])

	// const {store, dispatch, fetchAgenda} = useGlobalReducer();
  
	// useEffect(() => {
	// 	fetchAgenda()
	// }, [])

	return (
		<div className="text-center mt-5">
			<h1>Welcome to Rigo's Running App!</h1>
			<img src={rigoImageUrl} />
			<h5>Rigo's Running App is a community where you can</h5>
			<h5>meet with other runners to run together and even ask for mentorship!</h5>
			<div className = "mx-auto w-25 text-start">
			<h5>
				<ul>
					<li>Create your runner profile</li>
					<li>View other runner's profiles</li>
					<li>Favorite other runners to run with</li>
					<li>Schedule a time to meet and run</li>
					<li>Become a mentor!</li>
					<li>Seek a mentor!</li>
				</ul>
			</h5>
			</div>
			<Link to="/create_runner">
				<button className="btn btn-primary mx-2">Create Runner Profile</button>
			</Link>
			<Link to="/edit_runner/:theId">
				<button className="btn btn-primary mx-2">Edit Runner Profile</button>
			</Link>
			<Link to="/list_runners">
			{/* <Link to = "/single_runner/:theID/:pictureNumber">
				<button className = "btn btn-primary mx-2">Single Runner Profile</button>
			</Link> */}
				<button className="btn btn-primary mx-2">List Runners</button>
			</Link>
			<Link to="/list_mentors">
				<button className="btn btn-primary mx-2">List Mentors</button>
			</Link>
			{/* <Link to = "/">
				<button className = "btn btn-primary mx-2">Return Home</button>
			</Link> */}
		</div>
	);
}; 