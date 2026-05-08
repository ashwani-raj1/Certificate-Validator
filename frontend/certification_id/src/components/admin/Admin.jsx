import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function Admin() {

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {

            alert("Please login first");

            navigate("/signin");
        }

    }, []);

    /* FORM DATA */

    const [formData, setFormData] = useState({

        eventName: "",
        studentName: "",
        studentRoll: "",
        credential: "",
        date: ""
    });

    /* FILE STATE */

    const [file, setFile] = useState(null);

    /* HANDLE INPUT */

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]: e.target.value
        });
    };

    /* LOGOUT */

    const handleLogout = () => {

        localStorage.removeItem("token");

        alert("Logged Out Successfully");

        navigate("/");
    };

    /* MANUAL ENTRY */

    const handleSubmit = (e) => {

        e.preventDefault();

        fetch("http://localhost:5000/add", {

            method: "POST",

            headers: {
                "content-type": "application/json"
            },

            body: JSON.stringify(formData)

        })

        .then(res => res.json())

        .then(data => {

            console.log(data);

            alert("Certificate Added Successfully");

            setFormData({

                eventName: "",
                studentName: "",
                studentRoll: "",
                credential: "",
                date: ""
            });

        })

        .catch(err => console.log(err));
    };

    /* EXCEL UPLOAD */

    const handleFileUpload = async () => {

        if (!file) {

            return alert("Please select Excel file");
        }

        const uploadData = new FormData();

        uploadData.append("excelFile", file);

        fetch("http://localhost:5000/upload", {

            method: "POST",

            body: uploadData
        })

        .then(res => res.json())

        .then(data => {

            console.log(data);

            alert("Excel Uploaded Successfully");

            setFile(null);
        })

        .catch(err => console.log(err));
    };

    return (

        <div className="admin-container">

            {/* BACKGROUND BLOBS */}

            <div className="blob blue"></div>
            <div className="blob red"></div>
            <div className="blob yellow"></div>
            <div className="blob green"></div>

            {/* HEADER */}

            <div className="admin-header">

                <div>

                    <h1 className="admin-title">
                        Admin Dashboard
                    </h1>

                    <p className="admin-subtitle">
                        Manage certificate records and uploads
                    </p>

                </div>

                <button
                    className="logout-btn"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

            {/* GRID */}

            <div className="admin-grid">

                {/* MANUAL ENTRY */}

                <div className="admin-card">

                    <h2 className="card-title">
                        Manual Entry
                    </h2>

                    <form
                        className="admin-form"
                        onSubmit={handleSubmit}
                    >

                        <input
                            className="admin-input"
                            name="eventName"
                            value={formData.eventName}
                            onChange={handleChange}
                            placeholder="Enter Event Name"
                            required
                        />

                        <input
                            className="admin-input"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            placeholder="Enter Student Name"
                            required
                        />

                        <input
                            className="admin-input"
                            name="studentRoll"
                            value={formData.studentRoll}
                            onChange={handleChange}
                            placeholder="Enter Roll Number"
                            required
                        />

                        <input
                            className="admin-input"
                            name="credential"
                            value={formData.credential}
                            onChange={handleChange}
                            placeholder="Enter Certificate ID"
                            required
                        />

                        <input
                            className="admin-input"
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            required
                        />

                        <button
                            className="admin-btn"
                            type="submit"
                        >
                            Add Certificate
                        </button>

                    </form>

                </div>

                {/* EXCEL UPLOAD */}

                <div className="admin-card">

                    <h2 className="card-title">
                        Upload Excel File
                    </h2>

                    <p className="upload-text">
                        Upload multiple certificate records using Excel sheet.
                    </p>

                    <input
                        className="file-input"
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={(e) => setFile(e.target.files[0])}
                    />

                    <button
                        className="admin-btn"
                        onClick={handleFileUpload}
                    >
                        Upload Excel
                    </button>

                </div>

            </div>

        </div>
    );
}