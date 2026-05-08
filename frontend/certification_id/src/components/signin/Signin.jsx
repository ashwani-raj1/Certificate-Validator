import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Signin.css";

function Signin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await fetch("http://localhost:5000/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            const data = await res.json();

            console.log(data);

            if (data.valid) {

                localStorage.setItem("token", data.token);

                alert("Logged In Successfully");

                navigate("/admin");

            } else {

                alert("Invalid Credentials");

            }

        } catch (err) {

            console.log(err);

        }
    }

    return (

        <div className="signin-container">

            {/* Background Circles */}
            <div className="red-circle"></div>
            <div className="yellow-circle"></div>
            <div className="green-circle"></div>

            <form className="signin-form" onSubmit={handleSubmit}>

                <h1 className="signin-title">
                    Admin Login
                </h1>

                <p className="signin-subtitle">
                    Certificate Validator Dashboard
                </p>

                <input
                    className="signin-input"
                    type='email'
                    value={email}
                    placeholder='Enter Email'
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="signin-input"
                    type='password'
                    value={password}
                    placeholder='Enter Password'
                    onChange={(e) => setPassword(e.target.value)}
                />

                <button className="signin-btn" type='submit'>
                    Sign In
                </button>

                <p className="signin-footer">
                    Secure Admin Authentication System
                </p>

            </form>

        </div>
    )
}

export default Signin;