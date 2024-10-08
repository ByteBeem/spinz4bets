import React, { useState } from "react";
import axios from "axios";
import "./modal.scss";

const ErrorModal = ({ isOpen, onClose }) => {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [codeConfirmed, setCodeConfirmed] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [serverToken , setServerToken]=useState('');


  const handleOTPChange = (e) => {
    setCode(e.target.value);
  };

  const handleSubmit = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);
    const email = localStorage.getItem("ResetEmail");

    try {
      const response = await axios.post(
        "https://profitpilot.ddns.net/auth/confirm-otp",
        { code, email , type : "reset"}
      );

      if (response.status === 400) {
        setError("You entered Incorrect OTP, try again.");
      } else if (response.status === 200) {
        setServerToken(response.data.token);
        setCodeConfirmed(true);
      }
    } catch (error) {
      setError("You entered Incorrect OTP, try again.");
    }

    setIsLoading(false);
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleNewPasswordSubmit = async () => {
    setError("");
    setMessage("");
    setIsLoading(true);
    const email = localStorage.getItem("ResetEmail");
  
    try {
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        setIsLoading(false);
        return;
      }
  
      const response = await axios.post(
        "https://profitpilot.ddns.net/auth/changePassword",
        { email, newPassword  , serverToken}
      );
  
      if (response.status === 200) {
        setMessage("Password updated successfully , Go log in.");
        window.location.href = "https://spinz4bets.co.za";
      } else {
        setError("Failed to update password. Please try again later.");
      }
    } catch (error) {
      setError("Failed to update password. Please try again later.");
    }
  
    setIsLoading(false);
  };
  

  return (
    isOpen && (
      <div className="error-modal-overlay">
        <div className="error-modal">
          <button className="close-button" onClick={onClose}>
            X
          </button>
          {!codeConfirmed ? (
            <>
              
              <input
                type="number"
                value={code}
                onChange={handleOTPChange}
                placeholder="Enter the OTP you received on your email"
              />
              <button
                className="ok-button"
                disabled={isLoading}
                onClick={handleSubmit}
              >
                {isLoading ? "Verifying..." : "Submit"}
              </button>
            </>
          ) : (
            <>
              <input
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter New Password"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm New Password"
              />
              <button
                className="ok-button"
                disabled={isLoading}
                onClick={handleNewPasswordSubmit}
              >
                {isLoading ? "Updating..." : "Submit"}
              </button>
            </>
          )}

          {message && <p className="success-message">{message}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    )
  );
};

export default ErrorModal;