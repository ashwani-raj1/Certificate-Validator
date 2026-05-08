import React, { useState } from 'react';
import "./Verify.css";

function Verify() {

    const [certificateid, setCertificateid] = useState("");
    const [user, setUser] = useState(null);
    const[img , setImg] = useState(null);
    const[imgResult, setImgResult] = useState(null);

    const handleVerify = () => {

        fetch(`http://localhost:5000/verify/${certificateid}`)

            .then(res => res.json())

            .then(data => setUser(data))

            .catch(err => console.log(err));
    };

    const handleVerifyImg = async() =>{
        if(!img){
            return alert("Upload Image First")
        }
        const formData = new FormData();
        formData.append("certificate",img);
        const res = await fetch("http://localhost:5000/verify/verify-image",
        {
            method: "POST",
            body: formData
        })
        const data = await res.json();
        setImgResult(data);
    }

    return (

        <div className="verify-container">

            {/* BACKGROUND BLOBS */}

            <div className="blob blue"></div>
            <div className="blob red"></div>
            <div className="blob yellow"></div>
            <div className="blob green"></div>

            {/* VERIFY BOX */}

            <div className="verify-box">

                <h1 className="verify-title">
                    Certificate Verification
                </h1>

                <p className="verify-subtitle">
                    Enter your certificate ID to verify authenticity
                </p>

                <input
                    type="text"
                    placeholder="Enter Certificate ID"
                    value={certificateid}
                    onChange={(e) => setCertificateid(e.target.value)}
                    className="verify-input"
                />

                <button
                    onClick={handleVerify}
                    className="verify-button"
                >
                    Verify Certificate
                </button>

            </div>
            <div>
                <h2>Verify Certificate using image</h2>
                <input
                type='file'
                accept='image/*'
                onChange={(e)=>setImg(e.target.files[0])}
                />
                <button onClick={handleVerifyImg}>
                    Upload and verify
                </button>
            </div>
            {imgResult && (

    <div className="result-card">

        {imgResult.valid ? (

            <>

                <h2 className="success">

                    ✅ Certificate Verified

                </h2>

                <div className="certificate-details">

                    <p>
                        <span>Name:</span>
                        {imgResult.data.name}
                    </p>

                    <p>
                        <span>Institute:</span>
                        Roorkee Institute of Technology
                    </p>

                    <p>
                        <span>Roll No:</span>
                        {imgResult.data.roll}
                    </p>

                    <p>
                        <span>Event:</span>
                        {imgResult.data.event}
                    </p>

                    <p>
                        <span>Date:</span>
                        {imgResult.data.date}
                    </p>

                </div>

                <div className="verified-badge">

                    Authentic Certificate

                </div>

            </>

        ) : (

            <div className="error-box">

                <h2 className="error">

                    ❌ Verification Failed,
                    
                </h2>
                <p>Seems Like there could be error in reading image you can also verify via your credential manually</p>
                <p>

                    {imgResult.message}

                </p>

            </div>
        )}

    </div>
)}

            {/* RESULT */}

            {user && (

                <div className="result-card">

                    {user.valid ? (

                        <>

                            <h2 className="success">
                                ✅ Certificate Verified
                            </h2>

                            <div className="certificate-details">

                                <p>
                                    <span>Name:</span>
                                    {user.data.name}
                                </p>

                                <p>
                                    <span>Institute:</span>
                                    Roorkee Institute of Technology
                                </p>

                                <p>
                                    <span>Roll No:</span>
                                    {user.data.roll}
                                </p>

                                <p>
                                    <span>Event:</span>
                                    {user.data.event}
                                </p>

                                <p>
                                    <span>Date:</span>
                                    {user.data.date}
                                </p>

                            </div>

                            <div className="verified-badge">
                                Authentic Certificate
                            </div>

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