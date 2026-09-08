import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Project Info */}

        <div className="footer-section">
          <h2 className="footer-logo">Blockchain Certificate Verification</h2>

          <p className="footer-text">
            A blockchain-based certificate verification system built using
            React, Node.js, Express, MongoDB Atlas, Ethereum Sepolia, SHA-256
            hashing and OCR to provide secure, tamper-proof certificate
            authentication.
          </p>
        </div>

        {/* Quick Links */}

        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>

          <Link to="/" className="footer-link">
            Home
          </Link>

          <Link to="/about" className="footer-link">
            About
          </Link>

          <Link to="/verify" className="footer-link">
            Verify Certificate
          </Link>

          <Link to="/signin" className="footer-link">
            Admin Login
          </Link>
        </div>

        {/* Contact */}

        <div className="footer-section">
          <h3 className="footer-heading">Contact</h3>

          <p className="footer-text">Ashwani Raj</p>

          <p className="footer-text">Email: ashwaniraj084@gmail.com</p>

          <p className="footer-text">Phone: +91 9798018523</p>

          <div className="footer-socials">
            {/* Replace with your actual profile URLs */}

            <a
              href="https://github.com/ashwani-raj1"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/ashwani-raj-57480028a/"
              target="_blank"
              rel="noreferrer"
              className="social-link"
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}

      <div className="footer-bottom">
        <p>© 2026 Ashwani Raj. All Rights Reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
