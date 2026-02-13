import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import ContactCard from "../components/ContactCard.jsx";

export const ListUsers = () => {

  const {store, dispatch, fetchUsers} = useGlobalReducer();
  const [ users, setUsers ] = useState([]);

  useEffect(() => {
        fetchUsers()
        setUsers(store.users)
    }, [])

    useEffect(()=>{
        setUsers(store.users)
    }, [store.users])
    return (
        <div className = " contatiner text-center bg-light">
            <h1 className = "p-3">Runner List</h1>
            <div>
                {users?.length > 0 ? users.map((user, index) => {
                    let pictureNumber = index < 10 ? index : index - 9;
                    // console.log("pictureNumber: " + pictureNumber);
                    return (
                        <ContactCard
                            key = {user.id} 
                            contact = {user} 
                            pictureNumber={pictureNumber}
                        />
                    )
                })
                :
                <h2>Add a Profile</h2>
                }
            </div>
                <br />
                <div>
                    <Link to = "/">
                        <button className="btn btn-primary" style = {{marginBottom: 100}}>Return Home</button>
                    </Link>
                </div>
        </div>
    );
}; 