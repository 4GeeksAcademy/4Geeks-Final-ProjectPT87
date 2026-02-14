import React, { useContext, useState } from "react";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateAcccount =() =>{
    const[email, setEmail] =useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const registerUser= async()=>{
        let response = await fetch(process.env.BACKENDURL + "/register",{
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ 
                email: email,
                password: password
            })
        })
        let data = await response.json()
        navigate("/")
    }
    const loginUser = async()=>{
        
    }
    return (
            


    )
}