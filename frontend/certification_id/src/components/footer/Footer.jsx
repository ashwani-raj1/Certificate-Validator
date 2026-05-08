import React from "react";
import "./Footer.css";
import { Link } from "react-router-dom";

function Footer() {

    return (

        <footer className="footer">

            <div className="footer-container">

                {/* Left Section */}
                <div className="footer-section">

                    <h2 className="footer-logo">
                        Certificate Validator
                    </h2>

                    <p className="footer-text">
                        Secure and smart certificate verification platform
                        with admin dashboard, JWT authentication, and
                        Excel-based bulk uploads.
                    </p>

                </div>

                {/* Quick Links */}
                <div className="footer-section">

                    <h3 className="footer-heading">
                        Quick Links
                    </h3>

                    <Link to="/" className="footer-link">
                        Home
                    </Link>

                    <Link to="/about" className="footer-link">
                        About
                    </Link>

                    <Link to="/verify" className="footer-link">
                        Verify Certificate
                    </Link>

                    <Link to="/admin" className="footer-link">
                        Admin
                    </Link>

                </div>

                {/* Contact Section */}
                <div className="footer-section">

                    <h3 className="footer-heading">
                        Contact
                    </h3>

                    <p className="footer-text">
                        Email: support@certificatevalidator.com
                    </p>

                    <p className="footer-text">
                        Phone: +91 9876543210
                    </p>

                    <div className="footer-socials">

                        <a
                            href="https://linkedin.com"
                            target="_blank"
                            rel="noreferrer"
                            className="social-link"
                        >
                            LinkedIn
                        </a>

                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noreferrer"
                            className="social-link"
                        >
                            GitHub
                        </a>

                        <a
                            href="https://twitter.com"
                            target="_blank"
                            rel="noreferrer"
                            className="social-link"
                        >
                            Twitter
                        </a>

                    </div>

                </div>

            </div>

            {/* Bottom */}
            <div className="footer-bottom">

                <p>
                    © 2026 Certificate Validator. All Rights Reserved.
                </p>

            </div>

        </footer>
    );
}

export default Footer;