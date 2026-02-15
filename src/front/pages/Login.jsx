import React, { useState } from "react";
import { useActionState } from "react";
import { useNavigate } from "react-router-dom";

export const Login =() =>{
    const[email, setEmail] =useState("")
    const [password, setPassword] = useState("")

    const handleSubmit= async(e)=>{

        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/login`,
            {
            method: "POST",
            headers: { "Content-type": "application/json" },
            body: JSON.stringify({ 
                email, password
            })
        })
        if(resp.ok){
            const data = await response.json()
        }
    }
return(
            <form  onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" value={email} onChange={(e) => setEmail(e.target.value)}/>
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" value ={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
}

