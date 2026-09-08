import React from "react";
import "./About.css";

function About() {
  return (
    <div className="about-container">
      {/* Hero Section */}

      <section className="about-hero">
        <div className="hero-content">
          <h1 className="about-title">About The Project</h1>

          <p className="about-subtitle">
            A Blockchain-Based Certificate Verification System built using
            Ethereum Sepolia, SHA-256, MongoDB, OCR and React.
          </p>
        </div>

        <div className="hero-circle blue"></div>
        <div className="hero-circle red"></div>
        <div className="hero-circle yellow"></div>
        <div className="hero-circle green"></div>
      </section>

      {/* Content */}

      <section className="about-section">
        <div className="about-card">
          <h2>Project Overview</h2>

          <p>
            This project provides a secure certificate verification system using
            blockchain technology. Each certificate is converted into a SHA-256
            hash and stored on the Ethereum Sepolia blockchain. During
            verification, a new hash is generated from the certificate details
            and compared with the blockchain record to verify its authenticity
            and detect any tampering.
          </p>
        </div>

        <div className="about-card">
          <h2>Features</h2>

          <ul>
            <li>Blockchain-based certificate storage</li>

            <li>SHA-256 hash generation and verification</li>

            <li>Certificate verification using OCR</li>

            <li>Bulk certificate upload through Excel</li>

            <li>Admin dashboard with JWT authentication</li>

            <li>Tamper detection using blockchain hashes</li>

            <li>Transaction verification through Sepolia Etherscan</li>
          </ul>
        </div>

        <div className="about-card">
          <h2>Technology Stack</h2>

          <div className="tech-stack">
            <span>React</span>

            <span>Node.js</span>

            <span>Express.js</span>

            <span>MongoDB Atlas</span>

            <span>Ethereum</span>

            <span>Sepolia</span>

            <span>Hardhat</span>

            <span>Ethers.js</span>

            <span>SHA-256</span>

            <span>Tesseract OCR</span>

            <span>JWT</span>

            <span>Multer</span>

            <span>XLSX</span>

            <span>CSS</span>
          </div>
        </div>

        <div className="about-card">
          <h2>System Workflow</h2>

          <ol>
            <li>Admin uploads certificate information.</li>

            <li>A SHA-256 hash is generated.</li>

            <li>The hash is stored on Ethereum Sepolia.</li>

            <li>Certificate information is stored in MongoDB.</li>

            <li>
              Users verify certificates using the certificate ID or an uploaded
              image.
            </li>

            <li>
              The system regenerates the hash and compares it with the
              blockchain record.
            </li>

            <li>
              If both hashes match, the certificate is verified as authentic.
            </li>
          </ol>
        </div>

        <div className="about-card">
          <h2>Objective</h2>

          <p>
            The primary objective of this project is to prevent certificate
            forgery by using blockchain technology. Since blockchain records
            cannot be modified after deployment, any alteration to certificate
            data results in a different SHA-256 hash, allowing the system to
            identify tampered certificates immediately.
          </p>
        </div>
      </section>
    </div>
  );
}

export default About;
