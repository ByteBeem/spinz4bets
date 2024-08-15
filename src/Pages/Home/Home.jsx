import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Error from "../ErrorModal/ErrorModal";
import "./Home.scss";
import cup from "../../assets/cup.jpg";
import slot from "../../assets/slot.jpg";
import { FiLoader } from "react-icons/fi";

const Home = ({ showSidebar, active, closeSidebar }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [prevGames] = useState([
    { name: "Cup Guess", image: cup, minimum: "2" },
    { name: "Slot Machine", image: slot, minimum: "2" },
  ]);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(localStorage.getItem("userEmail") || "");
  const [maxContainerHeight, setMaxContainerHeight] = useState(window.innerHeight - 100);
  const token = localStorage.getItem("token");
  const country = localStorage.getItem("country");

  const handleResize = useCallback(() => {
    setMaxContainerHeight(window.innerHeight - 100);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    if (token && !userEmail) {
      fetchUserEmail();
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [token, userEmail, handleResize]);

  const fetchUserEmail = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://profitpilot.ddns.net/users/spinz4bets/email", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        const email = response.data.userEmail;
        localStorage.setItem("userEmail", email);
        setUserEmail(email);
      }
    } catch (error) {
      setErrorMessage("Failed to fetch user email.");
      setErrorModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchGameLink = useCallback(
    async (name) => {
      setLoading(true);
      try {
        const response = await axios.get("https://profitpilot.ddns.net/users/spinz4bets/play", {
          headers: { Authorization: `Bearer ${token}`, name },
        });
        if (response.status === 200) {
          window.location.href = response.data.link;
        }
      } catch (error) {
        setErrorMessage("Failed to fetch game link.");
        setErrorModalOpen(true);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const handlePlay = (gameName) => {
    if (gameName) {
      fetchGameLink(gameName);
    }
  };

  const getCurrencySymbol = () => (country !== "ZA" ? "R" : "R");

  return (
    <div className="home">
      {loading && (
        <div className="overlay">
          <FiLoader className="loading-spinner" />
        </div>
      )}
      <Sidebar active={active} closeSidebar={closeSidebar} />
      <div className="home_container">
        <Navbar showSidebar={showSidebar} />
        <div className="content">
          <div className="games_slider">
            <div className="scrollview" style={{ maxHeight: maxContainerHeight }}>
              <div className="card_container">
                {token ? (
                  prevGames.map((game, index) => (
                    <div key={index} className="card">
                      <img src={game.image} alt={`${game.name} image`} />
                      <div className="tournament_info">
                        <h3>{game.name}</h3>
                        <p>Minimum: {getCurrencySymbol()}{game.minimum}</p>
                        <button className="play-button" onClick={() => handlePlay(game.name)}>Play</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-games-message">
                    <p>No games found, Please Login.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} />}
    </div>
  );
};

export default Home;
