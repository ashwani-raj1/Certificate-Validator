import React, { useState } from "react";
import "./Verify.css";

function Verify() {
  const [certificateid, setCertificateid] = useState("");
  const [user, setUser] = useState(null);
  const [img, setImg] = useState(null);
  const [imgResult, setImgResult] = useState(null);
  const [isImageVerifying, setIsImageVerifying] = useState(false);

  const handleVerify = () => {
    setImgResult(null);

    fetch(`${import.meta.env.VITE_API_URL}/verify/${certificateid}`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.log(err));
  };

  const handleVerifyImg = async () => {
    setUser(null);

    if (!img) {
      return alert("Please upload an image first.");
    }

    const formData = new FormData();
    formData.append("certificate", img);
    setImgResult(null);
    setIsImageVerifying(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/verify/verify-image`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      setImgResult(data);
    } catch (error) {
      setImgResult({
        valid: false,
        message: "Unable to verify the image. Please try again.",
      });
    } finally {
      setIsImageVerifying(false);
    }
  };

  return (
    <div className="verify-container">

      {/* Background Blobs */}

      <div className="blob blue"></div>
      <div className="blob red"></div>
      <div className="blob yellow"></div>
      <div className="blob green"></div>

      {/* Manual Verification */}

      <div className="verify-box">

        <h1 className="verify-title">
          Certificate Verification
        </h1>

        <p className="verify-subtitle">
          Enter Certificate ID to verify authenticity using Blockchain.
        </p>

        <input
          className="verify-input"
          type="text"
          placeholder="Enter Certificate ID"
          value={certificateid}
          onChange={(e) => setCertificateid(e.target.value)}
          data-testid="certificate-id-input"
        />

        <button
          className="verify-button"
          onClick={handleVerify}
          data-testid="verify-certificate-button"
        >
          Verify Certificate
        </button>
        <p className="sample-certificates">
        Sample Certificate IDs:
        <strong> CERT_INFY_10</strong>,
        <strong> CERT_INFY_05</strong>,
        <strong> CERT_97989</strong>,
        <strong> CERT_99900</strong>
        </p>
      </div>

      {/* Image Verification */}

      <div className="upload-box">

        <h2>
          📷 Verify Certificate Using Image
        </h2>

        <p>
          Upload a certificate image and OCR will automatically detect the Certificate ID.
        </p>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImg(e.target.files[0])}
          disabled={isImageVerifying}
        />

        <button
          className="verify-button"
          onClick={handleVerifyImg}
          disabled={isImageVerifying}
        >
          {isImageVerifying ? "Scanning Certificate..." : "Upload & Verify"}
        </button>

      </div>

      {isImageVerifying && (
        <div className="scan-status" role="status" aria-live="polite">
          <div className="scanner-ring" aria-hidden="true">
            <div className="scanner-line"></div>
            <span>OCR</span>
          </div>
          <h2>Scanning certificate</h2>
          <p>Reading the Certificate ID and checking the blockchain record...</p>
        </div>
      )}

      {/* OCR RESULT */}

      {imgResult && (

        <div className="result-card">

          {imgResult.valid ? (

            <>

              <h2 className="success">
                ✅ Certificate Verified
              </h2>

              <div className="certificate-details">

                <p>
                  <span>Name</span>
                  {imgResult.data.name}
                </p>

                <p>
                  <span>Institute</span>
                  Roorkee Institute of Technology
                </p>

                <p>
                  <span>Roll Number</span>
                  {imgResult.data.roll}
                </p>

                <p>
                  <span>Event</span>
                  {imgResult.data.event}
                </p>

                <p>
                  <span>Date</span>
                  {imgResult.data.date}
                </p>

              </div>

              <div className="verified-badge">
                Authentic Certificate
              </div>

              {imgResult.transactionHash && (

                <button
                  className="verify-button"
                  style={{ marginTop: "20px" }}
                  onClick={() =>
                    window.open(
                      `https://sepolia.etherscan.io/tx/${imgResult.transactionHash}`,
                      "_blank"
                    )
                  }
                >
                  🔗 View on Blockchain
                </button>

              )}

            </>

          ) : (

            <div className="error-box">

              <h2 className="error">
                ❌ Verification Failed
              </h2>

              <p>
                {imgResult.message}
              </p>

              <p>
                OCR couldn't read the certificate correctly. Please verify manually using Certificate ID.
              </p>

            </div>

          )}

        </div>

      )}

      {/* Manual Result */}

      {user && (

        <div className="result-card">

          {user.valid ? (

            <>

              <h2 className="success" data-testid="certificate-verified">
                ✅ Certificate Verified
              </h2>

              <div className="certificate-details" data-testid="certificate-details">

                <p>
                  <span>Name</span>
                  {user.data.name}
                </p>

                <p>
                  <span>Institute</span>
                  Roorkee Institute of Technology
                </p>

                <p>
                  <span>Roll Number</span>
                  {user.data.roll}
                </p>

                <p>
                  <span>Event</span>
                  {user.data.event}
                </p>

                <p>
                  <span>Date</span>
                  {user.data.date}
                </p>

              </div>

              <div className="verified-badge">
                Authentic Certificate
              </div>

              {user.transactionHash && (

                <button
                  className="verify-button"
                  style={{ marginTop: "20px" }}
                  onClick={() =>
                    window.open(
                      `https://sepolia.etherscan.io/tx/${user.transactionHash}`,
                      "_blank"
                    )
                  }
                >
                  🔗 View on Blockchain
                </button>

              )}

            </>

          ) : (

            <div className="error-box">

              <h2 className="error">
                ❌ Verification Failed
              </h2>

              <p>
                {user.message}
              </p>

            </div>

          )}

        </div>

      )}

    </div>
  );
}

export default Verify;
