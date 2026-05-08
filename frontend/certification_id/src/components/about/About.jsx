import React from "react";
import "./About.css";

function About() {

    return (

        <div className="about-container">

            {/* HERO SECTION */}

            <section className="about-hero">

                <div className="hero-content">

                    <h1 className="about-title">
                        About Certificate Validator
                    </h1>

                    <p className="about-subtitle">
                        Smart, Secure & Modern Certificate Verification Platform
                    </p>

                </div>

                <div className="hero-circle red"></div>
                <div className="hero-circle yellow"></div>
                <div className="hero-circle green"></div>

            </section>

            {/* ABOUT SECTION */}

            <section className="about-section">

                <div className="about-card">

                    <h2>
                        Our Mission
                    </h2>

                    <p>
                        Certificate Validator helps institutions and
                        organizations verify certificates quickly and securely.
                        The platform reduces fake certifications and simplifies
                        the verification process using modern technologies.
                    </p>

                </div>

                <div className="about-card">

                    <h2>
                        Features
                    </h2>

                    <ul>

                        <li>
                            Secure JWT Authentication
                        </li>

                        <li>
                            Admin Dashboard Management
                        </li>

                        <li>
                            Excel Bulk Certificate Upload
                        </li>

                        <li>
                            Fast Certificate Verification
                        </li>

                        <li>
                            Responsive & Modern UI
                        </li>

                    </ul>

                </div>

                <div className="about-card">

                    <h2>
                        Technologies Used
                    </h2>

                    <div className="tech-stack">

                        <span>React</span>
                        <span>Node.js</span>
                        <span>Express</span>
                        <span>MongoDB</span>
                        <span>JWT</span>
                        <span>CSS3</span>

                    </div>

                </div>

            </section>

            {/* STATS SECTION */}

            <section className="stats-section">

                <div className="stat-box">

                    <h1>10K+</h1>
                    <p>Certificates Verified</p>

                </div>

                <div className="stat-box">

                    <h1>500+</h1>
                    <p>Institutions Connected</p>

                </div>

                <div className="stat-box">

                    <h1>99.9%</h1>
                    <p>Verification Accuracy</p>

                </div>

            </section>

        </div>
    );
}

export default About;