import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";
import { editRunner, fetchRunner } from "../hooks/actions.jsx";


export const EditRunner = () => {
    const {store, dispatch, fetchRunner, editRunner} = useGlobalReducer();
    const navigate = useNavigate();

    // below is the commented code curently not working, will recreate the edit runner with a new line of code


    const { theId } = useParams();

    const [currentRunnerInfo, setCurrentRunnerInfo] = useState({name: "", phone: "", email: "", address: ""})
    const [newRunnerInfo, setNewRunnerInfo] = useState({name: "", phone: "", email: "", address: "", years_running: "", schedule: "", location: ""})

    useEffect(() => {
        fetchRunner();
    }, []);

    useEffect(() => {
        let currentRunner = store.runners.filter((runner) => runner.id === parseInt(theId));

    if (currentRunner.length === 1) {
            setCurrentRunnerInfo(currentRunner[0]);
            setNewRunnerInfo(currentRunner[0]);
        }
    }, [store.runners]);
    
    const handleEditRunner = async (e) => {
        e.preventDefault(); // prevents page reload

        if (!newRunnerInfo.name || !newRunnerInfo.email ) {
            alert("Name and email fields are required");
            return;
        }
        await editRunner(newRunnerInfo);
        navigate("/list_runners");
    };

    return (
        <div className="container bg-light mt-5 p-3 w-50">
			<div className = "text-center mt-3">
				<h3>Edit Your Runner Profile</h3>
			</div>
			
            <div className = "mb-3">
				<label htmlFor = "name" className = "ms-2 mb-1">Name</label>
                <input 
                    id = "name"
                    className = "form-control"
                    type = "text"
                    value = {newRunnerInfo.name}
					onChange = {(e) => setNewRunnerInfo({...newRunnerInfo, name: e.target.value})}
				/>
			</div>
            
            <div className = "mb-3">
				<label htmlFor = "phone" className = "ms-2 mb-1">Phone</label>
                <input 
                    id = "phone"
                    className = "form-control"
					type = "text"
                    value = {newRunnerInfo.phone}
					onChange = {(e) => setNewRunnerInfo({...newRunnerInfo, phone: e.target.value})}
					
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "email" className = "ms-2 mb-1">Email</label>
                <input
                    id = "email"
                    className = "form-control"
					type = "text"
                    value = {newRunnerInfo.email}
					onChange = {(e) => setNewRunnerInfo({...newRunnerInfo, email: e.target.value})}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "address" className = "ms-2 mb-1">Address</label>
                <input 
                    id = "address"
                    className = "form-control"
					type = "text"
					value = {newRunnerInfo.address}
					onChange = {(e) => setNewRunnerInfo({...newRunnerInfo, address: e.target.value})}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "years_running" className = "ms-2 mb-1">Years Running</label>
                <input 
                    id = "years_running"
                    className = "form-control"
                    type = "text"
                    value = {newRunnerInfo.years_running}
					onChange = {(e) => setNewRunnerInfo({...newRunnerInfo, years_running: e.target.value})}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "schedule" className = "ms-2 mb-1">Running Schedule</label>
                <input 
                    id = "schedule"
                    className = "form-control"
                    type = "text"
                    value = {newRunnerInfo.schedule}
					onChange = {(e) => setNewRunnerInfo({...newRunnerInfo, schedule: e.target.value})}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "location" className = "ms-2 mb-1">Location</label>
                <input 
                    id = "location"
                    className = "form-control"
                    type = "text"
                    value = {newRunnerInfo.location}
					onChange = {(e) => setNewRunnerInfo({...newRunnerInfo, location: e.target.value})}
				/>
			</div>
            
            <div className = "d-flex justify-content-center">
                <button 
                    className = "btn btn-primary mx-2"
                    onClick = {(e) => handleEditRunner(e)}
                >
                    Update Runner Profile
                </button>
                <Link to="/list_runners">
                    <button className="btn btn-primary mx-2">List Runners</button>
                </Link>
                <Link to="/list_mentors">
                    <button className="btn btn-primary mx-2">List Mentors</button>
                </Link>
                <Link to = "/">
                    <button className = "btn btn-primary mx-2">Return Home</button>
                </Link>
            </div>
        </div>
    );
}; 