import React from "react";
import "./InfoModal.scss";

const InfoModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="info-modal-overlay">
      <div className="info-modal">
        <div className="info-modal-header">
          <h2>Important Information</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        <div className="info-modal-content">
          <h3>Regulations</h3>
          <p>
            This platform operates under the regulations set forth by the Financial Sector Conduct Authority (FSCA) in South Africa.
          </p>
          
          <h3>Security</h3>
          <p>
            We utilize advanced encryption technology to ensure your data and transactions are secure. Your personal and financial information is protected with industry-standard security measures.
          </p>
          
          <h3>South African Gambling Toll Lines</h3>
          <p>
            If you or someone you know has a gambling problem, please call the toll-free Gambling Helpline at 0800 006 008 for confidential advice and support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
