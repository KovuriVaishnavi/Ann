import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Register.css";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "donor",
    location: { landmark: "", lat: "", long: "" },
  });
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "landmark") {
      setFormData((prevData) => ({
        ...prevData,
        location: { ...prevData.location, landmark: value },
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const sendOtp = async () => {
    setIsLoading(true); // Start loading
    try {
      await axios.post("http://localhost:3001/api/auth/send-otp", {
        phone: formData.phone,
      });
      setIsOtpSent(true);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Failed to send OTP");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  const verifyAndRegister = async () => {
    setIsLoading(true); // Start loading
    try {
      await axios.post("http://localhost:3001/api/auth/verify-otp", {
        phone: formData.phone,
        otp,
      });

      const response = await axios.post(
        "http://localhost:3001/api/auth/register",
        formData
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setErrorMessage("");
      navigate("/dashboard");
    } catch (error) {
      setErrorMessage(error.response?.data?.msg || "Failed to register");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="registration-container">
      {isLoading ? (
        <div className="registration-form">
          <div className="spinner"></div>
          <h2>⏳ Just a Moment!</h2>
          <p>
            Good things take time. Your OTP is on its way and will arrive
            shortly...
          </p>
        </div>
      ) : (
        <>
          {/* Left Side: Form */}
          <div className="registration-form">
            <h1>Register</h1>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
            />
            <input
              type="text"
              name="landmark"
              placeholder="Landmark"
              value={formData.location.landmark}
              onChange={handleChange}
              className="input-field"
            />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="input-field"
            >
              <option value="donor">Donor</option>
              <option value="receiver">Receiver</option>
              <option value="volunteer">Volunteer</option>
            </select>

            {isOtpSent ? (
              <>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="input-field"
                />
                <button onClick={verifyAndRegister} className="submit-button">
                  Verify & Register
                </button>
              </>
            ) : (
              <button onClick={sendOtp} className="submit-button">
                Send OTP
              </button>
            )}

            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </div>

          {/* Right Side: Image and Quote */}
          <div className="registration-image">
            <div className="quote animate-quote">
              "A single grain shared with love can plant a garden of hope in
              someone’s heart!"
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Registration;
