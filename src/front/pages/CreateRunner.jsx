import React, { useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
// import { createRunner } from "../hooks/actions.js";

export const CreateRunner = () => {
    const [runner, setRunner] = useState({name: "", phone: "", email: "", address: ""})
    const {store, dispatch, addRunner} = useGlobalReducer();
    const navigate = useNavigate();

    const handleCreateRunner = async (e) => {
        e.preventDefault(); // prevents page reload

        if (!runner.name || !runner.phone || !runner.email || !runner.address) {
            alert("Please complete all fields");
            return;
        }
        await createRunner(runner);
        // console.log(runner);
        navigate("/list_runners");
    }

    return (
        <div className="container bg-light mt-5 p-3 w-50 shadow p-3 mb-5 bg-white rounded">
			<div className = "text-center mt-3">
				<h3>Create Runner Profile</h3>
			</div>
			
            <div className = "mb-3">
				<label htmlFor = "name" className = "ms-2 mb-1">Name</label>
                <input 
					id = "name"
                    className = "form-control"
                    type = "text"
					placeholder = "Enter the full name here"
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
					placeholder = "Enter the full phone number here"
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
					placeholder = "Enter the full email address here"
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
					placeholder = "Enter the full address here"
					onChange = {(e) => setRunner({...runner, address: e.target.value})}
					value = {runner.address}
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
                    <button className="btn btn-primary mx-2">List Runners</button>
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