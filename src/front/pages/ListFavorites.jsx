import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import React, { useState, useEffect } from 'react';
import { CharacterCard } from "../components/Card.jsx";

export const Favorites = () => {

  const {store, dispatch, getCharacters } =useGlobalReducer();
  const [favorites, setFavorites] = useState([]);
    
    useEffect ( () => {
        console.log(store.favorites.length, localStorage.getItem("favorites"))
        if (store.favorites.length == 0) {
            dispatch({
                type: "setFavorites",
                payload: {favorites: localStorage.getItem("favorites")}
            })
        }
        setFavorites(store.favorites)
    }, []);

    useEffect ( () => {
        setFavorites(store.favorites)
    }, [store.favorites]);

    return (
        <div className="text-center mt-5" style = {{marginBottom: 100}}>
            <h1>Favorites Page</h1>
            <div className = "d-flex col-10 overflow-auto mt-5 mx-auto">
                {favorites?.map((favorites, index) => {
                    return <CharacterCard key = {index} uid = {favorites.uid} name = {favorites.name} />
                })}
            </div>	
        </div>
    );
}; 