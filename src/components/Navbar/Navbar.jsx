import React, { useState, useEffect } from "react";
import axios from "axios";
import Auth from "../../Pages/Login/Auth";
import Error from "../../Pages/ErrorModal/ErrorModal";
import "./Navbar.scss";
import { FaCircleInfo } from "react-icons/fa6";
import InfoModal from "../../components/../Pages/InfoModal/InfoModal"; 

const Navbar = ({ showSidebar }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [infoModalOpen, setInfoModalOpen] = useState(false);  
  
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetchUserData(token);
    } else {
      setLoginModalOpen(true);
    }
  }, []);

  const fetchUserData = (token) => {
    setLoading(true);
    axios
      .get('https://profitpilot.ddns.net/users/spinz4bets/balance', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {
        const balance = response.data;
        if (balance !== undefined) {
          setUserData(balance);
          const code  = balance.acc;
          localStorage.setItem("ReferralCode" ,code );
        }
      })
      .catch((error) => {
        setErrorMessage(`${error.message} ,  Check Your internet connection`);
        setErrorModalOpen(true);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCurrencySymbol = () => {
    const country = userData.country;
    const symbol = country === 'ZA' ? 'R' : 'R';
    localStorage.setItem("country", country);
    return symbol;
  };

  return (
    <>
      <header>
        <li>
          <div className="balance">
            {loading ? "Loading..." : (
              userData.balance ? `${getCurrencySymbol()}${userData.balance}` :
                <button className="form_btn" onClick={() => setLoginModalOpen(true)}>Login</button>
            )}
          </div>
        </li>
       
        <li>
          <FaCircleInfo 
            className="icon" 
            onClick={() => setInfoModalOpen(true)} 
            title="Regulations & Security Info" 
          />
        </li>
       
      </header>
      
      {loginModalOpen && <Auth isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
      {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} />}
      {infoModalOpen && <InfoModal isOpen={infoModalOpen} onClose={() => setInfoModalOpen(false)} />}
    </>
  );
};

export default Navbar;
