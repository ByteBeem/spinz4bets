import React, { useState, useEffect } from "react";
import "./Profile.scss";
import "../../App.scss";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import UserProfile from "../../assets/user.jpeg";
import Error from "../ErrorModal/ErrorModal";
import Auth from "../../Pages/Login/Auth";
import { Link } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import Refer from "../../Pages/Referral/refer";


function Profile({ showSidebar, active, closeSidebar }) {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ userData, setUserData]=useState("");
  const [token , setToken] = useState('');

  const name = userData.name;
  const surname = userData.surname;
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {

      fetchUserData(token);
      fetchActivities(token);
      setToken(token);
    }
    
    else{
      setLoginModalOpen(true);
      
    }

  }, []);

  const DeleteAccount = async () =>{
    try{
      setLoading(true);
      const response =  await axios.post("https://profitpilot.ddns.net/users/delete-user" , {
        token

      })

      if(response.status === 200){
        localStorage.clear();
        window.location.href = "";
      };

    }catch(err){

    }finally{
      setLoading(false);

    }
  }

  const fetchActivities = async (token) => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://profitpilot.ddns.net/users/spinz4bets/activities",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      
      setActivities(response.data);
    } catch (error) {

    
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = (token) => {
    setLoading(true);
    axios
      .get("https://profitpilot.ddns.net/users/spinz4bets/getUserData", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then((response) => {

        setUserData(response.data);


      })
      .catch((error) => {

        
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="profile">
      {loading && (
        <div className="overlay">
          <FiLoader className="loading-spinner" />
        </div>
      )}
      <Sidebar active={active} closeSidebar={closeSidebar} />

      <div className="profile_container">
        <Navbar showSidebar={showSidebar} />

        <div className="top">
          <div className="user_info">
            <div className="profile_pic">
              <img src={UserProfile} alt="" />

            </div>

            <div className="text">
              <span>Fullname:</span>
              <div className="text_item">{name}</div>

              <span>Surname:</span>
              <div className="text_item">{surname}</div>

              <Refer />
            </div>
          </div>
        </div>

        <Link className="form_btn" to="/reset">
          Change Password
        </Link>

        <Link className="form_btn_delete" onClick={() => {
              
              DeleteAccount();
            }}>
          Delete account
        </Link>
        <div className="activity_table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Details</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity, index) => (
                <tr key={index}>
                  <td>{new Date(activity.Date).toDateString()}</td>
                  <td>{activity.Details}</td>
                  <td>{activity.Type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>


      {loginModalOpen && <Auth isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />}
      {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => setErrorModalOpen(false)} />}

    </div>
  );
}

export default Profile;