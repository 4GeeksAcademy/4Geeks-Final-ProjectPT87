import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import RunnerCard from "../components/RunnerCard.jsx";

export const ListRunners = () => {

  const {store, dispatch, fetchRunners} = useGlobalReducer();
  const [ runners, setRunners ] = useState([]);

  useEffect(() => {
        fetchRunners()
        setRunners(store.runners)
    }, [])

    useEffect(()=>{
        setRunners(store.runners)
    }, [store.runners])
    return (
        <div className = " contatiner text-center bg-light">
            <h1 className = "p-3">Runner List</h1>
            <div>
                {users?.length > 0 ? runners.map((runner, index) => {
                    let pictureNumber = index < 10 ? index : index - 9;
                    // console.log("pictureNumber: " + pictureNumber);
                    return (
                        <RunnerCard
                            key = {runner.id} 
                            contact = {runner} 
                            pictureNumber={pictureNumber}
                        />
                    )
                })
                :
                <h2>Add Runner Profile</h2>
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