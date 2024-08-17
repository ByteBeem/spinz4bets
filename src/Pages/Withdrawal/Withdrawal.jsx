import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import "./Withdraw.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Success from "../ErrorModal/Success";

function Withdraw({ showSidebar, active, closeSidebar }) {
  const [formData, setFormData] = useState({
    amount: "",
    account: "",
    bank: "",
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const token = localStorage.getItem("token");
  const countryCode = localStorage.getItem("country");

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.amount || isNaN(formData.amount) || formData.amount <= 0) {
      errors.amount = "Invalid withdrawal amount";
    }

    if (countryCode === "ZA") {
      if (!formData.account) errors.account = "Account number is required";
      if (!formData.bank) errors.bank = "Bank is required";
    } else {
      if (!formData.email) errors.email = "PayPal email is required";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    }

    setFormErrors(errors);
    setIsButtonDisabled(Object.keys(errors).length > 0);
  }, [formData, countryCode]);

  

  useEffect(() => {
    validateForm();
  }, [formData, validateForm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
    setError("");
    setMessage("");
  };

  const handleWithdraw = async () => {
    if (isButtonDisabled) return;

    const { amount, account, bank, password } = formData;

    if (amount < 200) {
      setFormErrors({ amount: "Minimum withdrawal is R200" });
      return;
    }

    const requestBody = { amount: parseFloat(amount), account, bank, password };

    setLoading(true);
    try {
      const response = await axios.post(
        "https://profitpilot.ddns.net/subscriptions/withdraw",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
           
          },
        }
      );
      setIsSuccessModalOpen(true);
      setMessage(`Withdrawal successful. New balance: R ${response.data.newBalance}`);
      setFormData((prevState) => ({
        ...prevState,
        amount: "",
        account: "",
        bank: "",
        password: "",
      }));
    } catch (err) {
      setError(err.response?.data?.error || "Withdrawal failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawPaypal = async () => {
    if (isButtonDisabled) return;

    const { amount, email, password } = formData;

    if (amount < 50) {
      setFormErrors({ amount: "Minimum withdrawal is $50" });
      return;
    }

    const requestBody = { amount: parseFloat(amount), email, password };

    setLoading(true);
    try {
      const response = await axios.post(
        "https://play929-1e88617fc658.herokuapp.com/wallet/withdrawPaypal",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            
          },
        }
      );
      setIsSuccessModalOpen(true);
      setMessage(`Withdrawal successful. Check your email. New balance: $${response.data.newBalance}`);
      setFormData((prevState) => ({ ...prevState, amount: "", email: "", password: "" }));
    } catch (err) {
      setError(err.response?.data?.error || "Error processing withdrawal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="withdraw">
      <Sidebar active={active} closeSidebar={closeSidebar} />
      <div className="withdraw_container">
        <Navbar showSidebar={showSidebar} />
        <div className="content">
          <div className="middle">
            <div className="left">
              {countryCode === "ZA" ? (
                <>
                  <h3>Withdraw Funds</h3>
                  {error && <p className="error-message">{error}</p>}
                  <div>
                    <label>Withdraw Amount</label>
                    <br />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      inputMode="numeric"
                      className={formErrors.amount ? "input-error" : ""}
                    />
                    {formErrors.amount && <p className="error-message">{formErrors.amount}</p>}
                  </div>
                  <div>
                    <label>Account Number</label>
                    <br />
                    <input
                      type="text"
                      name="account"
                      value={formData.account}
                      onChange={handleChange}
                      inputMode="numeric"
                      className={formErrors.account ? "input-error" : ""}
                    />
                    {formErrors.account && <p className="error-message">{formErrors.account}</p>}
                  </div>
                  <div>
                    <label>Password</label>
                    <br />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      inputMode="text"
                      className={formErrors.password ? "input-error" : ""}
                    />
                    {formErrors.password && <p className="error-message">{formErrors.password}</p>}
                  </div>
                  <div className="right">
                    <div className="dropdown_container">
                      <span>Select Bank:</span>
                      <br />
                      <select
                        className="dropdown"
                        name="bank"
                        value={formData.bank}
                        onChange={handleChange}
                        
                      >
                        <option value="">Select a Bank</option>
                        <option value="Capitec">Capitec Bank</option>
                        <option value="Standardbank">Standard Bank</option>
                        <option value="Tymebank">TymeBank</option>
                        <option value="Absa">Absa</option>
                        <option value="FNB">FNB</option>
                       
                      </select>
                      {formErrors.bank && <p className="error-message">{formErrors.bank}</p>}
                    </div>
                    <button
                      className="form_btn"
                      onClick={handleWithdraw}
                      disabled={loading || isButtonDisabled}
                    >
                      {loading ? "Processing..." : "Withdraw"}
                    </button>
                  </div>
                  {message && <p className="success-message">{message}</p>}
                 
                </>
              ) : (
                <>
                  <h4>Withdraw Funds - PayPal</h4>
                  <div>
                    <label>Withdraw Amount</label>
                    <br />
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      inputMode="numeric"
                      className={formErrors.amount ? "input-error" : ""}
                    />
                    {formErrors.amount && <p className="error-message">{formErrors.amount}</p>}
                  </div>
                  <div>
                    <label>PayPal Email</label>
                    <br />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      inputMode="email"
                      className={formErrors.email ? "input-error" : ""}
                    />
                    {formErrors.email && <p className="error-message">{formErrors.email}</p>}
                  </div>
                  <div>
                    <label>Password</label>
                    <br />
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      inputMode="text"
                      className={formErrors.password ? "input-error" : ""}
                    />
                    {formErrors.password && <p className="error-message">{formErrors.password}</p>}
                  </div>
                  <button
                    className="form_btn"
                    onClick={handleWithdrawPaypal}
                    disabled={loading || isButtonDisabled}
                  >
                    {loading ? "Processing..." : "Withdraw"}
                  </button>
                  {message && <p className="success-message">{message}</p>}
                  {error && <p className="error-message">{error}</p>}
                </>
              )}
            </div>
          </div>
          {isSuccessModalOpen && (
            <Success onClose={() => setIsSuccessModalOpen(false)} message={message} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Withdraw;
