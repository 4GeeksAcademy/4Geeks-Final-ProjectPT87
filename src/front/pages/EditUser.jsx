import React, { useState, useEffect } from "react";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link, useNavigate, useParams } from "react-router-dom";

export const EditUser = () => {
    const {store, dispatch, fetchUsers, editUsers} = useGlobalReducer();
    const navigate = useNavigate();
    const { theId } = useParams();

    const [currentUserInfo, setCurrentUserInfo] = useState({name: "", phone: "", email: "", address: ""})
    const [newUserInfo, setNewUserInfo] = useState({name: "", phone: "", email: "", address: ""})

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        let currentUser = store.users.filter((user) => user.id === parseInt(theId));

    if (currentUser.length === 1) {
            setCurrentUserInfo(currentUser[0]);
            setNewUserInfo(currentUser[0]);
        }
    }, [store.users]);
    
    const handleEditUser = async (e) => {
        e.preventDefault(); // prevents page reload

        if (!newUserInfo.name || !newUserInfo.phone || !newUserInfo.email || !newUserInfo.address) {
            alert("Please complete all fields!");
            return;
        }
        await editUser(newUserInfo);
        navigate("/list_users");
    };

    return (
        <div className="container bg-light mt-5 p-3 w-50">
			<div className = "text-center mt-3">
				<h3>Edit Your Profile</h3>
			</div>
			
            <div className = "mb-3">
				<label htmlFor = "name" className = "ms-2 mb-1">Name</label>
                <input 
                    id = "name"
                    className = "form-control"
                    type = "text"
                    value = {newUserInfo.name}
					onChange = {(e) => setNewUserInfo({...newUserInfo, name: e.target.value})}
				/>
			</div>
            
            <div className = "mb-3">
				<label htmlFor = "phone" className = "ms-2 mb-1">Phone</label>
                <input 
                    id = "phone"
                    className = "form-control"
					type = "text"
                    value = {newUserInfo.phone}
					onChange = {(e) => setNewContactInfo({...newUserInfo, phone: e.target.value})}
					
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "email" className = "ms-2 mb-1">Email</label>
                <input
                    id = "email"
                    className = "form-control"
					type = "text"
                    value = {newUserInfo.email}
					onChange = {(e) => setNewUserInfo({...newUserInfo, email: e.target.value})}
				/>
			</div>

            <div className = "mb-3">
				<label htmlFor = "address" className = "ms-2 mb-1">Address</label>
                <input 
                    id = "address"
                    className = "form-control"
					type = "text"
					value = {newUserInfo.address}
					onChange = {(e) => setNewUserInfo({...newUserInfo, address: e.target.value})}
				/>
			</div>
            <div className = "d-flex justify-content-center">
                <button 
                    className = "btn btn-primary mx-2"
                    onClick = {(e) => handleEditUser(e)}
                >
                    Update Profile
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