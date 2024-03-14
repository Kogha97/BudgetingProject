import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

export default function EmailConfirm() {
    const { token } = useParams();
    const [text, setText] = useState("Loading...");
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/users/emailconfirm/${token}`);
                console.log("🚀 ~ getData ~ response:", response);

                if (response.data.success) {
                    setText('Thank you for verifying your email. In a few seconds, you will be redirected to the Login Page.');
                    setTimeout(() => navigate("/login"), 3000);
                } else {
                    setText('Something went wrong. Please try the verification process again.');
                }
            } catch (error) {
                console.error("Error during email confirmation:", error);
                setText('An error occurred. Please try again later.');
            }
        };
        getData();
    }, [navigate, token]);

    return (
        <div style={pageStyle}>
            <div style={contentStyle}>
                <h1 style={titleStyle}>Email Verification</h1>
                <p style={textStyle}>{text}</p>
            </div>
        </div>
    );
}

// Styles
const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    color: '#fff',
    background: 'linear-gradient(to right, #00323b, #0a9396)',
    fontFamily: 'Arial, sans-serif',
};

const contentStyle = {
    textAlign: 'center',
    maxWidth: '600px',
    padding: '20px',
    borderRadius: '8px',
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(5px)',
};

const titleStyle = {
    marginBottom: '20px',
};

const textStyle = {
    fontSize: '16px',
    lineHeight: '1.5',
};
