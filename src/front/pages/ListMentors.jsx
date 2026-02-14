import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import MentorCard from "../components/MentorCard.jsx";


export const ListMentors = () => {

  const {store, dispatch, fetchMentors} = useGlobalReducer();
  const [ mentors, setMentors ] = useState([]);

  useEffect(() => {
        fetchMentors()
        setMentors(store.mentors)
    }, [])

    useEffect(()=>{
        setMentors(store.mentors)
    }, [store.mentors])
    return (
        <div className = " contatiner text-center bg-light">
            <h1 className = "p-3">Mentor List</h1>
            <div>
                {mentors?.length > 0 ? mentors.map((mentor, index) => {
                    let pictureNumber = index < 10 ? index : index - 9;
                    // console.log("pictureNumber: " + pictureNumber);
                    return (
                        <MentorCard
                            key = {mentor.id} 
                            contact = {mentor} 
                            pictureNumber={pictureNumber}
                        />
                    )
                })
                :
                <h2>Add Mentor Profile</h2>
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