import React from "react";
import "./Home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="home-container">

      <section className="hero-section">

        {/* LEFT */}

        <div className="hero-left">

          <div className="hero-tag">
            🚀 Blockchain Powered Certificate Verification
          </div>

          <h1 className="hero-title">
            Verify Certificates
            <br />
            <span>Using Blockchain Technology</span>
          </h1>

          <p className="hero-description">
            A blockchain-based certificate verification system that enables
            instant authentication using SHA-256 hashing, Ethereum Sepolia
            blockchain, MongoDB, OCR image verification, and an admin dashboard
            for secure certificate management.
          </p>

          <div className="hero-buttons">

            <Link to="/verify">
              <button className="primary-btn">
                Verify Certificate
              </button>
            </Link>

            <Link to="/signin">
              <button className="secondary-btn">
                Admin Login
              </button>
            </Link>

            <Link to="https://drive.google.com/file/d/1A7RHc4N5e_J7lUyzPPxPR0b9LvMGoXhv/view?usp=sharing">
              <button className="secondary-btn">
                Demo Video
              </button>
            </Link>

          </div>

          {/* PROJECT FEATURES */}

          <div className="trust-section">

            <div className="trust-box">
              🔐 Blockchain
            </div>

            <div className="trust-box">
              ⚡ SHA-256
            </div>

            <div className="trust-box">
              📄 OCR
            </div>

            <div className="trust-box">
              ☁ MongoDB
            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="hero-right">

          <div className="hero-card">

            <div className="card-top">

              <div className="window-circle window-red"></div>

              <div className="window-circle window-yellow"></div>

              <div className="window-circle window-green"></div>

            </div>

            <div className="card-content">

              <div className="verified-icon">
                ✅
              </div>

              <h2>Certificate Verified</h2>

              <p>
                Certificate ID:
                <br />
                <strong>CERT_INFY_01</strong>
              </p>

              <p>
                Status:
                <br />
                <strong>Verified on Blockchain</strong>
              </p>

              <div className="verified-badge">
                Authentic Certificate
              </div>

            </div>

          </div>

        </div>

        {/* BACKGROUND */}

        <div className="blob blue"></div>
        <div className="blob red-blob"></div>
        <div className="blob yellow-blob"></div>
        <div className="blob green-blob"></div>

      </section>

      {/* FEATURES */}

      <section className="features-section">

        <h2 className="features-title">
          Project Features
        </h2>

        <div className="features-grid">

          <div className="feature-card">
            <h3>🔐 Blockchain Security</h3>
            <p>
              Every certificate hash is securely stored on Ethereum Sepolia
              blockchain to prevent forgery and tampering.
            </p>
          </div>

          <div className="feature-card">
            <h3>📄 OCR Verification</h3>
            <p>
              Upload a certificate image and automatically extract the
              certificate ID using OCR for instant verification.
            </p>
          </div>

          <div className="feature-card">
            <h3>👨‍💻 Admin Dashboard</h3>
            <p>
              Add certificates manually or upload multiple certificates through
              Excel files with secure authentication.
            </p>
          </div>

          <div className="feature-card">
            <h3>⚡ Instant Verification</h3>
            <p>
              Certificate hashes are compared with blockchain records to verify
              authenticity within seconds.
            </p>
          </div>

          <div className="feature-card">
            <h3>🔍 Tamper Detection</h3>
            <p>
              Any modification in certificate data changes the SHA-256 hash,
              allowing instant tamper detection.
            </p>
          </div>

          <div className="feature-card">
            <h3>🌐 Blockchain Explorer</h3>
            <p>
              Open every verified transaction directly on Sepolia Etherscan to
              view blockchain proof.
            </p>
          </div>

        </div>

      </section>

    </div>
  );
}

export default Home;