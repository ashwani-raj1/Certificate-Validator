import React from 'react'
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    
    <div>
        <div className='main'>
            <div className='logo'>
                <a href="/"><img src='./image.png' alt='rit-logo'/></a>
            </div>

            <nav className='links-head'>
                <div className='links'>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/verify">Verify</Link>
                </div>
            </nav>
        </div>
    </div>
  )
}

export default Navbar