// Import necessary hooks and components from react-router-dom and other libraries.
import { Link, useParams } from "react-router-dom";  // To use link for navigation and useParams to get URL parameters
import PropTypes from "prop-types";  // To define prop types for this component
import rigoImageUrl from "../assets/img/rigo-baby.jpg";  // Import an image asset
import profile0 from "../assets/img/profile-0.jpg";
import profile1 from "../assets/img/profile-1.jpg";
import profile2 from "../assets/img/profile-2.jpg";
import profile3 from "../assets/img/profile-3.jpg";
import profile4 from "../assets/img/profile-4.jpg";
import profile5 from "../assets/img/profile-5.jpg";
import profile6 from "../assets/img/profile-6.jpg";
import profile7 from "../assets/img/profile-4.jpg";
import profile8 from "../assets/img/profile-8.jpg";
import profile9 from "../assets/img/profile-9.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Import a custom hook for accessing the global state
import React, { useState, useEffect } from "react";
// import pictureNumber from "./ListUsers";

// Define and export the Single component which displays individual item details.
export const SingleUser = props => {
  // Access the global state using the custom hook.
  const { store, dispatch, fetchContacts, editUser, deleteUser } = useGlobalReducer()
  const [ user, setUser ] = useState({});
  // Retrieve the 'theId' URL parameter using useParams hook.
  const { theId, pictureNumber } = useParams();

  useEffect(() => {
    const singleUser = store.users.find(user => user.id === parseInt(theId));
    if (singleUser) {
      setUser(singleUser)
    } else {
      fetchUsers()
      .then((foundUsers) => {
        const foundUser = foundUsers.find(user => user.id === parseInt(theId));
        return (foundUser)
      })
      .then((foundUser) => {
        setUser(foundUser);
      })
    }
  }, [])

  // let pictureNumber = index < 10 ? index : index - 9;
  // console.log(pictureNumber);
  let currentUrl = window.location.href.split("/single_user")[0];
  let pictureUrl = currentUrl + "/src/assets/img/profile-" + pictureNumber + ".jpg"

  return (
    <div style = {{marginBottom: 100}}>
      <div className="card mt-3 mx-auto w-50 shadow p-3 mb-5 bg-white rounded">
        {/* Display the title of the contact element dynamically retrieved from the store using theId. */}
        <div className = "contatiner text-center bg-light">
          <h1>Runner Profile</h1>
        </div>

          <img src={pictureUrl} className="" alt="Profile Picture" />

        <div className = "mt-4">
          <h4>Name: {user?.name}</h4>
          <h4>Phone: {user?.phone}</h4>
          <h4>Email: {user?.email}</h4>
          <h4>Address: {user?.address}</h4>
        </div>
        
        <hr className="my-4" />  {/* A horizontal rule for visual separation. */}

        {/* A Link component acts as an anchor tag but is used for client-side routing to prevent page reloads. */}
        <div className = "d-flex justify-content-center">
					<Link to="/list_users">
					  <button className="btn btn-primary mx-2">List Runners</button>
					</Link>
          <Link to = {"/edit_user/" + user.id}>
            <button className="btn btn-primary mx-2" href="#" role="button">
              Edit Runner Profile
            </button>
          </Link>
          <Link to="/list_usesrs">
            <button 
              className="btn btn-primary mx-2" 
              href="#" 
              role="button"
              onClick={() => deleteUser(contact.id)}
              >
                Delete Runner Profile
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

// Use PropTypes to validate the props passed to this component, ensuring reliable behavior.
SingleUser.propTypes = {
  // Although 'match' prop is defined here, it is not used in the component.
  // Consider removing or using it as needed.
  match: PropTypes.object
};