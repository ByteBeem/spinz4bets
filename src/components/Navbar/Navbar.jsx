import React, { useState, useEffect } from "react";
import axios from "axios";
import Auth from "../../Pages/Login/Auth";
import Error from "../../Pages/ErrorModal/ErrorModal";
import "./Navbar.scss";


const Navbar = ({ showSidebar }) => {
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedGame, setSelectedGame] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  


  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


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
    const symbol = country === 'ZA' ? 'R' : '$';
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
          <div className="acc">
            <h6>Acc no</h6>
            <p>{loading ? "Loading..." : userData.balance ? `${userData.acc || null}` : ""}</p>
          </div>
        </li>

      </header>
      
      {loginModalOpen && <Auth isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
      {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} />}
      
    </>
  );
};

export default Navbar;