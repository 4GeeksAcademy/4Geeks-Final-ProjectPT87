import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import RunnerCard from "../components/RunnerCard.jsx";

// This page lists all of the runner cards so that users can scroll through
export const ListRunners = ({ runner }) => {

  const {store, dispatch, fetchRunner} = useGlobalReducer();
  const [ runners, setRunners ] = useState([]);

  useEffect(() => {
        fetchRunner()
        setRunners(store.runners)
    }, [])

    useEffect(()=>{
        setRunners(store.runners)
    }, [store.runners])
    return (
        <div className = " contatiner text-center bg-light">
            <h1 className = "p-3">Runner List</h1>
            <div>
                {runners?.length > 0 ? runners.map((runner, index) => {
                    let pictureNumber = index < 10 ? index : index - 9;
                    // console.log("pictureNumber: " + pictureNumber);
                    return (
                        <RunnerCard
                            key = {runner.id} 
                            runner = {runner} 
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