
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css"; // Add this CSS file for styling

const Login = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const sendOtp = async () => {
    try {
      const response = await axios.post("http://localhost:3001/api/auth/login", { phone });
      console.log(response);
      await axios.post("http://localhost:3001/api/auth/send-otp", { phone });
      setIsOtpSent(true);
      setErrorMessage("");
      alert("OTP sent to your phone");
    } catch (error) {
      setErrorMessage("Failed to send OTP. Please try again.");
    }
  };
  // const sendOtp = async () => {
  //   try {
  //     // Check if the user exists using the login endpoint
  //     const response = await axios.post("http://localhost:3001/api/auth/login", { phone });
  //     console.log(response);
  
  //     // Check if the response status is 200
  //     if (response.status === 200) {
  //       // User exists, send OTP
  //       await axios.post("http://localhost:3001/api/auth/sent-otp", { phone });
  //       setIsOtpSent(true);
  //       setErrorMessage("");
  //       alert("OTP sent to your phone");
  //     }
  //   } catch (error) {
  //     if (error.response?.status === 404) {
  //       setErrorMessage("User not found. Please register first.");
  //     } else {
  //       setErrorMessage("Failed to send OTP. Please try again.");
  //     }
  //   }
  // };
  
  
  const verifyAndLogin = async () => {
    try {
      await axios.post("http://localhost:3001/api/auth/verify-otp", { phone, otp });
      const response = await axios.post("http://localhost:3001/api/auth/login", { phone });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setErrorMessage("");
      alert("Login successful");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Failed to login. Please check the OTP and try again.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1>Login</h1>
        <input
          type="text"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="input-field"
        />

        {isOtpSent ? (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="input-field"
            />
            <button onClick={verifyAndLogin} className="submit-button">
              Verify & Login
            </button>
          </>
        ) : (
          <button onClick={sendOtp} className="submit-button">
            Send OTP
          </button>
        )}

        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
    </div>
  );
};

export default Login;