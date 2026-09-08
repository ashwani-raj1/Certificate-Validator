import React, { useState } from "react";
import "./Verify.css";

function Verify() {
  const [certificateid, setCertificateid] = useState("");
  const [user, setUser] = useState(null);
  const [img, setImg] = useState(null);
  const [imgResult, setImgResult] = useState(null);
  const [isImageVerifying, setIsImageVerifying] = useState(false);
  const [isManualVerifying, setIsManualVerifying] = useState(false);

  const handleVerify = async () => {
    setImgResult(null);
    setIsManualVerifying(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/verify/${certificateid}`,
      );
      setUser(await res.json());
    } catch {
      setUser({
        valid: false,
        message: "Unable to verify the certificate. Please try again.",
      });
    } finally {
      setIsManualVerifying(false);
    }
  };

  const handleVerifyImg = async () => {
    setUser(null);
    if (!img) return alert("Please upload an image first.");
    const formData = new FormData();
    formData.append("certificate", img);
    setImgResult(null);
    setIsImageVerifying(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/verify/verify-image`,
        { method: "POST", body: formData },
      );
      setImgResult(await res.json());
    } catch {
      setImgResult({
        valid: false,
        message: "Unable to verify the image. Please try again.",
      });
    } finally {
      setIsImageVerifying(false);
    }
  };

  const result = user || imgResult;

  return (
    <div className="verify-container">
      <div className="blob blue" />
      <div className="blob red" />
      <div className="blob yellow" />
      <div className="blob green" />

      <div className="verify-layout">
        <section className="verify-actions">
          <div className="verify-box">
            <h1 className="verify-title">Certificate Verification</h1>
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
              disabled={isManualVerifying}
              data-testid="verify-certificate-button"
            >
              {isManualVerifying && (
                <span className="button-spinner" aria-hidden="true" />
              )}
              {isManualVerifying ? "Verifying..." : "Verify Certificate"}
            </button>
            <p className="sample-certificates">
              Sample Certificate IDs: <strong>CERT_INFY_10</strong>,{" "}
              <strong>CERT_INFY_05</strong>, <strong>CERT_97989</strong>,{" "}
              <strong>CERT_99900</strong>
            </p>
          </div>

          <div className="upload-box">
            <h2>📷 Verify Certificate Using Image</h2>
            <p>
              Upload a certificate image and OCR will automatically detect the
              Certificate ID.
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
              {isImageVerifying && (
                <span className="button-spinner" aria-hidden="true" />
              )}
              {isImageVerifying ? "Scanning..." : "Upload & Verify"}
            </button>
          </div>
        </section>

        <aside className="verify-result-panel" aria-live="polite">
          {!result ? (
            <div className="result-placeholder">
              <span>✓</span>
              <h2>Verification Result</h2>
              <p>
                Your certificate details will appear here after verification.
              </p>
            </div>
          ) : result.valid ? (
            <div className="result-card">
              <h2 className="success" data-testid="certificate-verified">
                ✅ Certificate Verified
              </h2>
              <div
                className="certificate-details"
                data-testid="certificate-details"
              >
                <p>
                  <span>Name</span>
                  {result.data.name}
                </p>
                <p>
                  <span>Institute</span>Roorkee Institute of Technology
                </p>
                <p>
                  <span>Roll Number</span>
                  {result.data.roll}
                </p>
                <p>
                  <span>Event</span>
                  {result.data.event}
                </p>
                <p>
                  <span>Date</span>
                  {result.data.date}
                </p>
              </div>
              <div className="verified-badge">Authentic Certificate</div>
              {result.transactionHash && (
                <button
                  className="verify-button"
                  onClick={() =>
                    window.open(
                      `https://sepolia.etherscan.io/tx/${result.transactionHash}`,
                      "_blank",
                    )
                  }
                >
                  🔗 View on Blockchain
                </button>
              )}
            </div>
          ) : (
            <div className="result-card error-box">
              <h2 className="error">❌ Verification Failed</h2>
              <p>{result.message}</p>
              {imgResult && (
                <p>
                  OCR couldn't read the certificate correctly. Please verify
                  manually using Certificate ID.
                </p>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

export default Verify;
