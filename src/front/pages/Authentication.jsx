import React, { useState } from "react";
import {useNavigate } from "react-router-dom";
import "./authentication.css"

export const Authentication=() =>{
    const[email, setEmail] =useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("")
    const [isSignUp, setIsSignUp] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) =>{
        e.preventDefault();

   const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/login`, 
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })  
        }
    );
        const data = await response.json();
        if (response.ok){
            localStorage.setItem("token", data.token)
            navigate("/")
        }else{
            alert(data.msg || "Try again, wrong credentials.")
        }
    }
        const handleRegister = async (e) => {
        e.preventDefault();

           const response = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password })
                }
            );
            const data = await response.json();

            if(response.ok){
                setIsSignUp(false);
                setPassword("");
            }
            else{
                alert(data.msg || "Registration failed.")
            }
    };
    
return(
<div className="authentication-body">
    <div className={`auth-container ${isSignUp ? "right-panel-active" : ""}`} id="container">

        <div className="form-container sign-up-container">
            <form onSubmit={handleRegister}>
            <h1>Create Account</h1>

            <div className="social-container">
                <a href="#" className="social" onClick={(e) => e.preventDefault()}>
                <i className="fab fa-google-plus-g"></i>
                </a>
            </div>

            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <button type="submit">Sign Up</button>
            </form>
        </div>

        <div className="form-container sign-in-container">
            <form onSubmit={handleLogin}>
            <h1>Sign in</h1>

            <div className="social-container">
                <a href="#" className="social" onClick={(e) => e.preventDefault()}>
                <i className="fab fa-google-plus-g"></i>
                </a>
            </div>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />

            <a href="#" onClick={(e) => e.preventDefault()}>
                Forgot your password?
            </a>

            <button type="submit">Sign In</button>
            </form>
        </div>

        <div className="overlay-container">
            <div className="overlay">
            <div className="overlay-panel overlay-left">
                <h1>Welcome Back!</h1>
                <button
                className="ghost"
                type="button"
                onClick={() => setIsSignUp(false)}
                >
                Sign In
                </button>
            </div>

            <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your account information meet new running partners</p>
                <button
                className="ghost"
                type="button"
                onClick={() => setIsSignUp(true)}
                >
                Sign Up
                </button>
            </div>
            </div>
        </div>

    </div>
</div>

        


            
        )
        
    }