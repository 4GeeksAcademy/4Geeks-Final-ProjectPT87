import React, { useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { createRunner } from "../hooks/actions.jsx";


export const CreateRunner = () => {
    const [runner, setRunner] = useState({
        name: "", 
        phone: "", 
        email: "", 
        address: "", 
        years_running: "", 
        schedule: "", 
        location: "",
        rating: "",
        level: "",
        is_mentor: "",
    })
    const {store, dispatch, addRunner} = useGlobalReducer();
    const navigate = useNavigate();

    const handleCreateRunner = async (e) => {
        e.preventDefault(); // prevents page reload

        if (!runner.name || !runner.email ) {
            alert("Name and email fields are required.");
            return;
        }

        //  
        await createRunner(dispatch, runner);
        // console.log(runner);
        navigate("/list_runners");
    }

    return (
        <div className="container bg-light mt-5 p-3 w-50 shadow p-3 mb-5 bg-white rounded">
			<div className = "text-center mt-3">
				<h3>Create Profile</h3>
			</div>
			
            <div className = "mb-3">
				<label htmlFor = "name" className = "ms-2 mb-1">Name</label>
                <input 
					id = "name"
                    className = "form-control"
                    type = "text"
					placeholder = "Enter your full name"
					onChange = {(e) => setRunner({...runner, name: e.target.value})}
					value = {runner.name}
				/>
			</div>
            
            <div className = "mb-3">
				<label htmlFor = "phone" className = "ms-2 mb-1">Phone</label>
                <input 
                    id = "phone"
                    className = "form-control"
					type = "text"
					placeholder = "Enter your complete phone number"
					onChange = {(e) => setRunner({...runner, phone: e.target.value})}
					value = {runner.phone}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "email" className = "ms-2 mb-1">Email</label>
                <input 
                    id = "email"
                    className = "form-control"
					type = "text"
					placeholder = "Enter your full email address"
					onChange = {(e) => setRunner({...runner, email: e.target.value})}
					value = {runner.email}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "address" className = "ms-2 mb-1">Address</label>
                <input 
                    id = "address"
                    className = "form-control"
					type = "text"
					placeholder = "Enter your address"
					onChange = {(e) => setRunner({...runner, address: e.target.value})}
					value = {runner.address}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "years_running" className = "ms-2 mb-1">Years Running</label>
                <input 
					id = "years_running"
                    className = "form-control"
                    type = "text"
					placeholder = "Number of years you have been running"
					onChange = {(e) => setRunner({...runner, years_running: e.target.value})}
					value = {runner.years_running}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "schedule" className = "ms-2 mb-1">Running Schedule</label>
                <input 
					id = "schedule"
                    className = "form-control"
                    type = "text"
					placeholder = "Your running schedule"
					onChange = {(e) => setRunner({...runner, schedule: e.target.value})}
					value = {runner.schedule}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "location" className = "ms-2 mb-1">Location</label>
                <input 
					id = "location"
                    className = "form-control"
                    type = "text"
					placeholder = "Where do you live and run?"
					onChange = {(e) => setRunner({...runner, location: e.target.value})}
					value = {runner.location}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "rating" className = "ms-2 mb-1">Rating</label>
                <input 
					id = "rating"
                    className = "form-control"
                    type = "text"
					placeholder = "What is your current rating?"
					onChange = {(e) => setRunner({...runner, rating: e.target.value})}
					value = {runner.rating}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "level" className = "ms-2 mb-1">Level</label>
                <input 
					id = "level"
                    className = "form-control"
                    type = "text"
					placeholder = "What is your current level?"
					onChange = {(e) => setRunner({...runner, level: e.target.value})}
					value = {runner.level}
				/>
			</div>

            {/* Need to create a yes no button for is_mentor */}
            <div className = "mb-3">
				<label htmlFor = "is_mentor" className = "ms-2 mb-1">Mentor?</label>
                <input 
					id = "is_mentor"
                    className = "form-control"
                    type = "bool"
					placeholder = "Are you a mentor?"
					onChange = {(e) => setRunner({...runner, is_mentor: e.target.value})}
					value = {runner.is_mentor}
				/>
			</div>

            <div className = "d-flex justify-content-center">
                <button 
                    className = "btn btn-primary mx-2"
                    onClick = {(e) => handleCreateRunner(e)}
                >
                    Create Runner Profile
                </button>
                {/* <Link to="/list_runners">
                    <button className="btn btn-primary mx-2">List list_runners</button>
                </Link>
                <Link to="/list_mentors">
                    <button className="btn btn-primary mx-2">List Mentors</button>
                </Link> */}
                <Link to = "/">
                    <button className = "btn btn-primary mx-2">Return Home</button>
                </Link>
            </div>
        </div>
    );
}; 