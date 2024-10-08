import React, { Component } from "react";
import axios from "axios";
import "./Deposit.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";


class Deposit extends Component {
  constructor(props) {
    super(props);

    this.state = {
      amount: "",
      csrfToken: "",
      loading: false,
      message: "",
      error: "",
      currentBalance: "0.00",
      show: true,
      showPayPalButtons: false,
      depositMethod: "", 
    };

    this.countryCode = localStorage.getItem("country");
    this.token = localStorage.getItem("token");
    this.idClient = localStorage.getItem("idclient");
  }

  handleDeposit = () => {
    this.setState({ error: "", message: "", loading: true });

    if (!this.token) {
      this.setState({
        error: "Token not found, please log in again.",
        loading: false,
      });
      return;
    }

    const { amount } = this.state;

    if (isNaN(amount) || amount <= 0) {
      this.setState({ error: "Invalid amount", loading: false });
      return;
    }

    if (amount < 10) {
      this.setState({ error: "Minimum amount is R10", loading: false });
      return;
    }

    if (amount > 1000) {
      this.setState({ error: "Maximum amount is R1000", loading: false });
      return;
    }

    const requestBody = {
      amount: parseFloat(amount),
      countryCode: this.countryCode,
      token: this.token,
    };

    axios
      .post(
        "https://profitpilot.ddns.net/subscriptions/create-payment",
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        }
      )
      .then((response) => {
        this.setState({ message: `Redirecting...` });

        window.location.href =
          response.data.paymentLink.paylinkUrl ||
          response.data.paymentLink;
        this.setState({ amount: "" });
      })
      .catch((error) => {
        this.setState({
          error: "Deposit failed. " + error.response.data.error,
        });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  };

  handleMethodSelection = (method) => {
    this.setState({ depositMethod: method, error: "", message: "" });
  };

  renderBankDetails = () => {
    return (
      <div className="footer">
        <label>Bank Transfer Details</label>
        <p>
          Capitec: <strong>2054670215</strong> (use your email as reference)
        </p>
        <p>
          Standard Bank: <strong>10229863475</strong> (use your email as
          reference)
        </p>
        <p>
          FNB: <strong>63113353469</strong> (use your email as reference)
        </p>
        <p>
          Absa: <strong>4110551341</strong> (use your email as reference)
        </p>
      </div>
    );
  };

  render() {
    const {
      amount,
      message,
      error,
      showPayPalButtons,
      depositMethod,
    } = this.state;
    const { showSidebar, active, closeSidebar } = this.props;

    return (
      <div className="deposit">
        <Sidebar active={active} closeSidebar={closeSidebar} />
        <div className="deposit_container">
          <Navbar showSidebar={showSidebar} />
          <div className="content">
            <div className="middle">
              <div className="deposit_form">
                <h2>Select Deposit Method</h2>
                <div className="method-selection">
                  <button
                    onClick={() => this.handleMethodSelection("onlineEFT")}
                    className={
                      depositMethod === "onlineEFT" ? "selected" : ""
                    }
                  >
                    Online EFT
                  </button>
                  <button
                    onClick={() => this.handleMethodSelection("bankTransfer")}
                    className={
                      depositMethod === "bankTransfer" ? "selected" : ""
                    }
                  >
                    Bank Transfer
                  </button>
                </div>

                {depositMethod === "onlineEFT" && (
                  <>
                    <h2>
                      <b>Safe and Secure :</b>{" "}
                    </h2>
                    <div>
                      <label>Deposit Amount</label>
                      <br />
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) =>
                          this.setState({ amount: e.target.value })
                        }
                        inputMode="numeric"
                      />

                      {message && (
                        <p className="success-message">{message}</p>
                      )}
                      {error && <p className="error-message">{error}</p>}
                    </div>
                    <button
                      className="form_btn"
                      onClick={this.handleDeposit}
                      disabled={this.state.loading}
                    >
                      {this.state.loading ? "Processing..." : "Make Payment"}
                    </button>
                  </>
                )}

                {depositMethod === "bankTransfer" && this.renderBankDetails()}
              </div>

              <div className="footer">
                <p>
                  Deposits are processed securely and swiftly using trusted
                  payment gateways like Ikhokha , Paypal and Yoco.
                </p>
                <p>
                  We do not store any of your banking information. Your
                  financial details are handled directly by our secure payment
                  partners.
                </p>
                <p>
                  Your privacy and security are our top priorities. We adhere to
                  strict data protection regulations and industry-standard
                  security measures to safeguard your information.
                </p>
                <p>
                  For any inquiries or assistance, please contact our customer
                  support team at{" "}
                  <span className="contact-email">
                    support@Spinz4bets.co.za
                  </span>
                  .
                </p>
                <p>© 2024 Spinz4bets. All rights reserved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Deposit;
