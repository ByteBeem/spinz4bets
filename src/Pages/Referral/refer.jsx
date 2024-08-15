import React, { useState } from 'react';
import { Button, InputGroup, FormControl } from 'react-bootstrap';
import Navbar from "../../components/Navbar/Navbar";
import './refer.scss';

function Refer({ showSidebar}) {
  const [referralLink, setReferralLink] = useState('');
  const referralCode = localStorage.getItem('ReferralCode');

  const generateReferralLink = () => {
    const link = `spinz4bets.co.za/?r=${referralCode}`;
    setReferralLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
      .then(() => alert('Copied to clipboard'))
      .catch((err) => console.error('Failed to copy:', err));
  };

  return (
    <div className="refer-page">
      
      <Navbar showSidebar={showSidebar} />

      <div className="refer-content">
        <h2>Invite Friends & Earn</h2>
        <p>
          Share your unique referral link with friends. When they join and deposit any amount,
          you'll receive the same amount they deposited!
        </p>
        
        <Button variant="primary" onClick={generateReferralLink} className="generate-btn">
          Generate Referral Link
        </Button>
        
        {referralLink && (
          <div className="referral-link-section">
            <p>Your Referral Link:</p>
            <InputGroup className="mb-3 referral-input-group">
              <FormControl
                readOnly
                value={referralLink}
                className="referral-input"
              />
              <Button variant="outline-secondary" onClick={copyToClipboard} className="copy-btn">
                Copy
              </Button>
            </InputGroup>
          </div>
        )}
      </div>
    </div>
  );
}

export default Refer;
