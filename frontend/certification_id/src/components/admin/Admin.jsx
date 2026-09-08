import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Admin.css";

export default function Admin() {
  const navigate = useNavigate();

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    alert("Your session has expired. Please sign in again.");
    navigate("/signin");
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/adminData`, {
      headers: { Authorization: token },
    })
      .then((response) => {
        if (response.status === 401) handleUnauthorized();
      })
      .catch(() => {
        // Keep the user signed in if there is only a temporary network error.
      });
  }, [handleUnauthorized, navigate]);

  /* FORM DATA */

  const [formData, setFormData] = useState({
    eventName: "",
    studentName: "",
    studentRoll: "",
    credential: "",
    date: "",
  });

  /* FILE STATE */

  const [file, setFile] = useState(null);

  /* HANDLE INPUT */

  const handleChange = (e) => {
    setFormData({
      ...formData,

      [e.target.name]: e.target.value,
    });
  };

  /* LOGOUT */

  const handleLogout = () => {
    localStorage.removeItem("token");

    alert("Logged Out Successfully");

    navigate("/");
  };

  /* MANUAL ENTRY */

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/signin");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      // Request failed
      if (!response.ok || !data.success) {
        return alert(data.message || data.error);
      }

      // Success
      setFormData({
        eventName: "",
        studentName: "",
        studentRoll: "",
        credential: "",
        date: "",
      });

      const openBlockchain = window.confirm(
        `${data.message}

Transaction Hash:
${data.transactionHash}

Do you want to view it on Blockchain?`,
      );

      if (openBlockchain) {
        window.open(
          `https://sepolia.etherscan.io/tx/${data.transactionHash}`,
          "_blank",
        );
      }
    } catch (err) {
      console.error(err);

      alert("Server Error");
    }
  };
  /* EXCEL UPLOAD */

  const handleFileUpload = async () => {
    if (!file) {
      return alert("Please select Excel file");
    }

    const uploadData = new FormData();

    uploadData.append("excelFile", file);

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login first");
      navigate("/signin");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      headers: { Authorization: token },
      body: uploadData,
    })
      .then(async (res) => ({ status: res.status, data: await res.json() }))

      .then(({ status, data }) => {
        if (status === 401) {
          handleUnauthorized();
          return;
        }

        console.log(data);

        if (data.message) {
          alert(data.message);

          setFile(null);
        } else {
          alert(data.error);
        }
      })

      .catch((err) => console.log(err));
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
          <h1 className="admin-title">Admin Dashboard</h1>

          <p className="admin-subtitle">
            Manage certificate records and uploads
          </p>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* GRID */}

      <div className="admin-grid">
        {/* MANUAL ENTRY */}

        <div className="admin-card">
          <h2 className="card-title">Manual Entry</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
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

            <button className="admin-btn" type="submit">
              Add Certificate
            </button>
          </form>
        </div>

        {/* EXCEL UPLOAD */}

        <div className="admin-card">
          <h2 className="card-title">Upload Excel File</h2>

          <p className="upload-text">
            Upload multiple certificate records using Excel sheet.
          </p>

          <input
            className="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button className="admin-btn" onClick={handleFileUpload}>
            Upload Excel
          </button>
        </div>
      </div>
    </div>
  );
}
