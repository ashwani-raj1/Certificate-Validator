import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {

    return (

        <div className="home-container">

            {/* HERO SECTION */}

            <section className="hero-section">

                {/* LEFT SIDE */}

                <div className="hero-left">

                    <div className="hero-tag">
                        🚀 Smart Certificate Verification Platform
                    </div>

                    <h1 className="hero-title">

                        Verify Certificates
                        <br />

                        <span>
                            Instantly & Securely
                        </span>

                    </h1>

                    <p className="hero-description">

                        Modern certificate verification platform with
                        secure authentication, admin dashboard,
                        bulk Excel uploads, and real-time verification.

                    </p>

                    <div className="hero-buttons">

                        <Link to="/verify">

                            <button className="primary-btn">

                                Verify Now

                            </button>

                        </Link>

                        <Link to="/about">

                            <button className="secondary-btn">

                                Learn More

                            </button>

                        </Link>

                    </div>

                    {/* TRUST SECTION */}

                    <div className="trust-section">

                        <div className="trust-box">
                            🔒 Secure
                        </div>

                        <div className="trust-box">
                            ⚡ Fast
                        </div>

                        <div className="trust-box">
                            ✅ Trusted
                        </div>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="hero-right">

                    <div className="hero-card">

                        {/* TOP BAR */}

                        <div className="card-top">

                            <div className="window-circle window-red"></div>

                            <div className="window-circle window-yellow"></div>

                            <div className="window-circle window-green"></div>

                        </div>

                        {/* CONTENT */}

                        <div className="card-content">

                            <div className="verified-icon">
                                ✅
                            </div>

                            <h2>
                                Certificate Verified
                            </h2>

                            <p>
                                Certificate ID:
                                CERT2026-4589
                            </p>

                            <div className="verified-badge">
                                Authentic Certificate
                            </div>

                        </div>

                    </div>

                </div>

                {/* BACKGROUND BLOBS */}

                <div className="blob blue"></div>

                <div className="blob red-blob"></div>

                <div className="blob yellow-blob"></div>

                <div className="blob green-blob"></div>

            </section>

            {/* STATS SECTION */}

            <section className="stats-section">

                <div className="stat-card">

                    <h1>
                        10K+
                    </h1>

                    <p>
                        Certificates Verified
                    </p>

                </div>

                <div className="stat-card">

                    <h1>
                        500+
                    </h1>

                    <p>
                        Institutions Connected
                    </p>

                </div>

                <div className="stat-card">

                    <h1>
                        99.9%
                    </h1>

                    <p>
                        Verification Accuracy
                    </p>

                </div>

            </section>

            {/* FEATURES SECTION */}

            <section className="features-section">

                <h1 className="section-title">

                    Why Choose Us?

                </h1>

                <div className="features-grid">

                    <div className="feature-card">

                        <div className="feature-icon">
                            🔒
                        </div>

                        <h2>
                            Secure Verification
                        </h2>

                        <p>
                            JWT authentication and secure database
                            validation for trusted verification.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon">
                            ⚡
                        </div>

                        <h2>
                            Fast Processing
                        </h2>

                        <p>
                            Verify certificates instantly with
                            high-speed backend integration.
                        </p>

                    </div>

                    <div className="feature-card">

                        <div className="feature-icon">
                            📊
                        </div>

                        <h2>
                            Admin Dashboard
                        </h2>

                        <p>
                            Manage and upload certificate records
                            easily using Excel sheets.
                        </p>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;