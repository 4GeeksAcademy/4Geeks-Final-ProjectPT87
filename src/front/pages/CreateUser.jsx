import React, { useState } from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate } from "react-router-dom";
import { addContact } from "../hooks/actions.js";

export const CreateUser = () => {
    const [user, setUser] = useState({name: "", phone: "", email: "", address: ""})
    const {store, dispatch, addUser} = useGlobalReducer();
    const navigate = useNavigate();

    const handleCreateContact = async (e) => {
        e.preventDefault(); // prevents page reload

        if (!user.name || !user.phone || !user.email || !user.address) {
            alert("Please complete all fields");
            return;
        }
        await addUser(user);
        // console.log(user);
        navigate("/list_users");
    }

    return (
        <div className="container bg-light mt-5 p-3 w-50 shadow p-3 mb-5 bg-white rounded">
			<div className = "text-center mt-3">
				<h3>Create a Profile!</h3>
			</div>
			
            <div className = "mb-3">
				<label htmlFor = "name" className = "ms-2 mb-1">Name</label>
                <input 
					id = "name"
                    className = "form-control"
                    type = "text"
					placeholder = "Enter the full name here"
					onChange = {(e) => setContact({...user, name: e.target.value})}
					value = {user.name}
				/>
			</div>
            
            <div className = "mb-3">
				<label htmlFor = "phone" className = "ms-2 mb-1">Phone</label>
                <input 
                    id = "phone"
                    className = "form-control"
					type = "text"
					placeholder = "Enter the full phone number here"
					onChange = {(e) => setContact({...user, phone: e.target.value})}
					value = {user.phone}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "email" className = "ms-2 mb-1">Email</label>
                <input 
                    id = "email"
                    className = "form-control"
					type = "text"
					placeholder = "Enter the full email address here"
					onChange = {(e) => setContact({...user, email: e.target.value})}
					value = {user.email}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "address" className = "ms-2 mb-1">Address</label>
                <input 
                    id = "address"
                    className = "form-control"
					type = "text"
					placeholder = "Enter the full address here"
					onChange = {(e) => setContact({...user, address: e.target.value})}
					value = {user.address}
				/>
			</div>
            <div className = "d-flex justify-content-center">
                <button 
                    className = "btn btn-primary mx-2"
                    onClick = {(e) => handleCreateContact(e)}
                >
                    Create Profile
                </button>
                <Link to="/list_users">
                    <button className="btn btn-primary mx-2">List Runners</button>
                </Link>
                <Link to = "/">
                    <button className = "btn btn-primary mx-2">Return Home</button>
                </Link>
            </div>
        </div>
    );
}; 