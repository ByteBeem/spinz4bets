import "./Sidebar.scss";
import "../../App.scss";
import { Link } from "react-router-dom";
import { IoHome } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { IoLogOut } from "react-icons/io5";
import { GiWallet } from "react-icons/gi";
import { useState } from "react";


const Sidebar = ({ active, closeSidebar }) => {
  const [loading, setLoading] = useState(false);
  const [activeItem, setActiveItem] = useState("home");
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    setLoading(true);
    localStorage.clear();
    setTimeout(() => {
      setLoading(false);
      window.location.href = "";
      closeSidebar();
    }, 2000);
  };
  return (
    <aside className={`sidebar ${active}`}>
      {loading && (
        <div className="overlay">
          <FiLoader className="loading-spinner" />
          <p className="loading-text">Logging out...</p>
        </div>
      )}
      <div className="top">
        <h3>Spinz4bets</h3>
        <div className="close_btn">&times;</div>
      </div>

      <div className="middle">
        <Link
          onClick={() => setActiveItem("home")}
          className={activeItem === "home" ? "link active" : "link"}
          to="/dashboard"
        >
          <IoHome className="icon" />
          <span>Home</span>
        </Link>

        {token &&

          <Link
            onClick={() => setActiveItem("wallet")}
            className={activeItem === "wallet" ? "link active" : "link"}
            to="/wallets"
          >
            <GiWallet className="icon" />
            <span>Wallet</span>
          </Link>

        }

        {token &&

          <Link className="link" to="/profile">
            <FaUser className="icon" />
            <span>Profile</span>
          </Link>
        }


        {token &&

          <Link
            className="link"
            to=""
            onClick={() => {
              closeSidebar();
              handleLogout();
            }}
          >
            <IoLogOut className="icon" />
            <span>Logout</span>
          </Link>
        }
      </div>
    </aside>
  );
};

export default Sidebar;