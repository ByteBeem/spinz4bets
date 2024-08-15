import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReferralHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const referralCode = queryParams.get('r');

    if (referralCode) {
      fetch(`/api/referral?r=${referralCode}`)
        .then(response => response.json())
        .then(data => {
          if (data.message === 'Valid referral code') {
            navigate('/'); 
          } else {
            console.error('Invalid referral code');
            navigate('/'); 
          }
        })
        .catch(error => {
          console.error('Error processing referral code:', error);
          navigate('/'); 
        });
    } else {
      navigate('/'); 
    }
  }, [location.search, navigate]);

  return <div>Processing referral code...</div>;
};

export default ReferralHandler;
