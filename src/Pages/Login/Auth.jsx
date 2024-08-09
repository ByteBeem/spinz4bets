import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Modal from "../CodeModal/modal";
import Modal2 from "../CodeModal/Modal2";
import { countries as countriesList } from "countries-list";
import { validateRequired, validateEmail } from "../Validation/Validation";
import "./Login.scss";

const Login = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ ID: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [isResetLoading, setIsResetLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModal2Open, setIsModal2Open] = useState(false);
 
  
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);


  const validateemail = (email) => {
    const emailRegex = new RegExp(
      "^(?!\\.)[a-zA-Z0-9._%+-]+@(?!-)[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
    );
    return emailRegex.test(email);
  }
  

  useEffect(() => {
        setIsButtonDisabled(
          errorMessage ||
            !formData.Email ||
            !formData.password
        );
    }, [errorMessage, formData.email ,formData.password]);



  const [signUpFormData, setSignUpFormData] = useState({
    full: "",
    surname: "",
    email: "",
    password: "",
    confirmPassword: "",
    country: "ZA",
    ID : "",
    terms:false,
  });

  const [section, setSection] = useState(1);
  const [errorSignUpMessage, setErrorSignUpMessage] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const countryOptions = Object.entries(countriesList)
      .map(([code, country]) => ({
        code,
        name: country.name,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
    setCountries(countryOptions);
  }, []);


  const validatePassword = (password, confirmPassword) => {
    if (password !== confirmPassword) {
      return "Passwords do not match";
    } else if (
      password.length < 6 ||
      !/[0-9]/.test(password) ||
      !/[a-zA-Z]/.test(password)
    ) {
      return "Password must be at least 6 characters long and contain both letters and numbers";
    }
    return "";
  };

  const validateName = (name) => {
    const nameRegex = /^[A-Za-z\s]+$/;
    return nameRegex.test(name);
  };


  const handleChangeSignUp = (e) => {
    const { name, value } = e.target;
    setSignUpFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleBack = () => {
    setErrorSignUpMessage("");
    setSection((prevSection) => prevSection - 1);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const closeModal2 = () => {
    setIsModal2Open(false);
  };

  const handleNext = () => {
    setErrors({
      full: "",
      surname: "",
      email: "",
      ID: "",
      password: "",
      confirmPassword: "",
      country: "",
    });

    if (section === 1) {
      if (!validateName(signUpFormData.full)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          full: "Invalid full name. Use letters and spaces only",
        }));
        return;
      }
      if (!validateName(signUpFormData.surname)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          surname: "Invalid surname. Use letters and spaces only",
        }));
        return;
      }
      if (!validateemail(signUpFormData.email)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: "Invalid email ",
        }));
        return;
      }
    }
    if (section === 2) {
      if (signUpFormData.country === "ZA") {
      
    
      }
    }

    
    setSection((prevSection) => prevSection + 1);
  };

  const handleSubmitSignUp = async (e) => {
    setErrorSignUpMessage("");
    e.preventDefault();
    const { full, surname, country, email, password  , confirmPassword , ID , terms} = signUpFormData;

    if (!validateEmail(email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email",
      }));
      return;
    }



    if(!terms){

      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Please agree to terms & conditions."
      }))
      return;

    }
    

    if(!validatePassword(password)){
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "password must have more than 8 characters."
      }))
      return;
    }

    if(confirmPassword != password){
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Password do not match."
      }))
      return;
    }

    setIsLoading(true);
    localStorage.setItem("email", email);

    try {
      const response = await axios.post("https://play929.azurewebsites.net/auth/signup", {
        full,
        surname,
        country,
        email,
        password,
        ID,
        terms
      });

      if (response.status === 200) {
        setShowSignUp(false);
        setShowForgotPassword(false);
        setFormData({ email: "", password: "" });
        setSignUpFormData({
          full: "",
          surname: "",
          email: "",
          password: "",
          confirmPassword: "",
          country: "ZA",
          ID,
          terms:false
        });
        setIsLoading(false);
        setErrorMessage("");
        setSection(1);
        setErrorMessage("");
        setIsLoading(false);
        setErrorMessage("");
        setErrorMessage("");
        setIsResetLoading(false);
        setIsModalOpen(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorSignUpMessage(error.response.data.error);
        
        setIsLoading(false);
       
      } else {
        setErrorSignUpMessage("Signup failed. Please try again.");
        
        setIsLoading(false);
    
      }
      setIsLoading(false);
      
    }
  };

  const handleChange = (e) => {
    setErrorMessage("");
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const { Email, password } = formData;


    if (!validateRequired(Email)) {

      setErrors((prevErrors) => ({
        ...prevErrors,
        ID: "Email is Required",
      }));
      return;

    }

    if (!validateRequired(password)) {

      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Password is Required",
      }));
      return;

    }

  

    setIsLoading(true);

    try {
      const response = await axios.post("https://profitpilot.ddns.net/auth/login", {
        Email,
        password,
       
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.token);
        window.location.href = "https://play929.vercel.app";
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setErrorMessage(error.response.data.error);
       
      } else {
        setErrorMessage("Login failed. Please try again.");
      
      }
    }

    setIsLoading(false);
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleSignUpClick = () => {
    setShowSignUp(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowSignUp(false);
    setFormData({ email: "", password: "" });
    setSignUpFormData({
      full: "",
      surname: "",
      email: "",
      password: "",
      confirmPassword: "",
      country: "ZA",
    });
    setErrorMessage("");
    setSection(1);
    setIsLoading(false);
    setIsResetLoading(false);
    setMessage("");
  };

  const handleChangeForgotPassword = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmitReset = async (e) => {
    setMessage("");
    e.preventDefault();

    const { email } = formData;
    if (!email || !email.trim() || !validateEmail(email)) {
      setMessage("Please enter a valid email address.");
      return;
    }

   
    localStorage.setItem("ResetEmail", email);
    setIsResetLoading(true);

    try {
      const response = await axios.post("https://play929-1e88617fc658.herokuapp.com/auth/resetPassword", {
        email,
        
      });

      if (response.status === 200) {
        setIsModal2Open(true);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setMessage(error.response.data.error);
        
      } else {
        setMessage("Failed to reset password. Please try again later.");
       
      }
    }

    setIsResetLoading(false);
  };

 

  return (
    isOpen && (
      <div className={`error-modal-overlay ${showForgotPassword ? "forgot-password-mode" : ""}`}>
        <div className={`login ${showForgotPassword ? "forgot-password-mode" : ""}`}>
          <div className="login_container">
            <button className="login-close-button" onClick={onClose}>
              X
            </button>
            {!showForgotPassword && !showSignUp ? (
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="numeric"
                    id="Email"
                    name="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                    className={errors.ID ? "error-input" : "valid-input"}
                  />
                  {errors.ID && <p className="error-message">{errors.ID}</p>}
                </div>
                <label htmlFor="password">Password</label>
                <div className="password-input-container">
                  <input
                    type= "text" 
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={errors.password ? "error-input" : "valid-input"}
                  />
                  
                </div>
                {errors.password && <p className="error-message">{errors.password}</p>}
                
                <button
                  type="submit"
                  className={`form_btn ${isLoading ? "disabled" : ""}`}
                  disabled={isLoading || isButtonDisabled}
                  aria-busy={isLoading}
                >
                  {isLoading ? "Logging In..." : "Log In"}
                </button>
                {isLoading && <div className="loading-spinner" />}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
              </form>
            ) : showForgotPassword ? (
              <div className="forgot-password-form">
                <h2>Reset Your Password</h2>
                <div className="forgot-password-container">
                  <form onSubmit={handleSubmitReset}>
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChangeForgotPassword}
                        required
                      />
                    </div>
                    
                    <button
                      type="submit"
                      className={`form_btn ${isResetLoading ? "disabled" : ""}`}
                      disabled={isResetLoading}
                      aria-busy={isResetLoading}
                    >
                      {isResetLoading ? "Resetting..." : "Reset"}
                    </button>
                  </form>
                  {message && <p className="message">{message}</p>}
                </div>
                <button onClick={handleBackToLogin}>Back to Login</button>
              </div>
            ) : (
              <div className="form">
                <form onSubmit={handleSubmitSignUp}>
                  {section === 1 && (
                    <>
                      <div className="input-group">
                        <label htmlFor="full">Full Name(s): </label>
                        <input
                          type="text"
                          id="full"
                          name="full"
                          value={signUpFormData.full}
                          onChange={handleChangeSignUp}
                          required
                        />
                        {errors.full && <p className="error-message">{errors.full}</p>}
                      </div>
                      <div className="input-group">
                        <label htmlFor="surname">Surname: </label>
                        <input
                          type="text"
                          id="surname"
                          name="surname"
                          value={signUpFormData.surname}
                          onChange={handleChangeSignUp}
                          required
                        />
                        {errors.surname && <p className="error-message">{errors.surname}</p>}
                      </div>
                      <div className="input-group">
                        <label htmlFor="email">Email: </label>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          value={signUpFormData.email}
                          onChange={handleChangeSignUp}
                          required
                        />
                        {errors.email && <p className="error-message">{errors.email}</p>}
                      </div>
                    </>
                  )}

                  {section === 2 && (
                    <>
                      <div className="input-group">
                        <label htmlFor="country">Country: </label>
                        <select
                          id="country"
                          className="dropdown"
                          name="country"
                          value={signUpFormData.country}
                          onChange={handleChangeSignUp}
                          required
                        >
                          {countries.map((country) => (
                            <option key={country.code} value={country.code}>
                              {country.name}
                            </option>
                          ))}
                        </select>
                        <div className="input-group">
                        <label htmlFor="email">ID number: </label>
                        <input
                          type="numeric"
                          id="ID"
                          name="ID"
                          value={signUpFormData.ID}
                          onChange={handleChangeSignUp}
                          required
                        />
                        {errors.ID && <p className="error-message">{errors.ID}</p>}
                      </div>

                        {errors.country && <p className="error-message">{errors.country}</p>}
                      </div>
                    </>
                  )}

                  {section === 3 && (
                    <>
                      <div className="input-group">
                        <label htmlFor="password">Password: </label>
                        <input
                          type="text"
                          id="password"
                          name="password"
                          value={signUpFormData.password}
                          onChange={handleChangeSignUp}
                          required
                        />
                       
                        {errors.password && <p className="error-message">{errors.password}</p>}
                      </div>
                      <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password: </label>
                        <input
                          type="text"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={signUpFormData.confirmPassword}
                          onChange={handleChangeSignUp}
                          required
                        />
                      
                      {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
                      </div>
                      <div>
                      <label htmlFor="agreeToTerms">
                        <input
                          type="checkbox"
                          id="terms"
                          name="terms"
                          checked={signUpFormData.terms}
                          onChange={handleChangeSignUp}
                          required
                        />
                        I agree to the terms and conditions
                      </label>
                      {errors.agreeToTerms && (
                        <p className="error-message">{errors.agreeToTerms}</p>
                      )}
                    </div>
                    </>
                  )}



                  <div className="navigation-buttons">
                    {section > 1 && (
                      <button type="button" onClick={handleBack}>
                        Back
                      </button>
                    )}
                    {section < 3 && (
                      <button type="button" onClick={handleNext}>
                        Next
                      </button>
                    )}
                    {section === 3 && (
                      <button type="submit" className="form_btn" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register"}
                      </button>
                    )}
                  </div>
                  {isLoading && <div className="loading-spinner" />}
                  {errorSignUpMessage && <p className="error-message">{errorSignUpMessage}</p>}
                </form>
              </div>
            )}
            {!showForgotPassword && (
              <div className="bottom">
                <span>
                  Don't have an account?{" "}
                  <Link className="link" to="#" onClick={handleSignUpClick}>
                    Signup
                  </Link>
                </span>
                <span>
                  Forgot Password?{" "}
                  <Link className="reset_btn" to="#" onClick={handleForgotPasswordClick}>
                    Reset
                  </Link>
                </span>
              </div>
            )}
          </div>
          <Modal isOpen={isModalOpen} onClose={closeModal} />
          <Modal2 isOpen={isModal2Open} onClose={closeModal2} />
        </div>
      </div>
    )
  );
};

export default Login;