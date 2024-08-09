import React, { Component } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Error from "../ErrorModal/ErrorModal";
import "./Home.scss";
import cup from "../../assets/cup.jpg";


class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      errorMessage: "",
      errorModalOpen: false,
      prevGames: [
      
        { name: 'Cup Guess', image: cup, minimum: '2' },
       
      ],
      loading: false,
      userEmail: "",
      maxContainerHeight: window.innerHeight - 100,
      isSidebarOpen: false,
    
      country : ""
    };

    this.token = localStorage.getItem('token');
    this.country = localStorage.getItem("country");
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
    if (this.token) {
      this.fetchUserEmail();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({ maxContainerHeight: window.innerHeight - 100 });
  }

  fetchUserEmail = async () => {
    this.setState({ loading: true });

    try {
      const response = await axios.get('https://profitpilot.ddns.net/users/spinz4bets/email', {
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      });

      if (response.status === 200) {
        const userEmail = response.data.userEmail;
        localStorage.setItem('userEmail', userEmail);
        this.setState({ userEmail, loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  handlePlay = (gameName) => {
    if(gameName === "Chess"){
      this.setState({isCreateOpen : true});
    }

    if(gameName === "Word Search"){
      this.setState({isWordOpen: true});
    }
  };

  getCurrencySymbol = () => {
    const symbol = this.country === 'ZA' ? 'R' : '$';
    return symbol;
  };

  render() {
    const { showSidebar, active, closeSidebar } = this.props;
    const { maxContainerHeight, errorModalOpen, errorMessage, prevGames } = this.state;

    const statuses = [
     
      { label: "", image: cup },
      
    ];

    return (
      <div className="home">
        <Sidebar active={active} closeSidebar={closeSidebar} />
        <div className="home_container">
          <Navbar showSidebar={showSidebar} />
          <div className="content">
         
            <div className="games_slider">
              <div className="scrollview" style={{ maxHeight: maxContainerHeight }}>
                <div className="card_container">
                  {this.token ? (
                    prevGames.map((game, index) => (
                      <div key={index} className="card">
                        <img src={game.image} alt={`${game.name} image`} />
                        <div className="tournament_info">
                          <h3>{game.name}</h3>
                          <p>Minimum: {this.getCurrencySymbol()}{game.minimum}</p>
                          <button className="play-button" onClick={() => this.handlePlay(game.name)}>Play</button>
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
        {errorModalOpen && <Error errorMessage={errorMessage} isOpen={errorModalOpen} onClose={() => this.setState({ errorModalOpen: false })} />}
       
      </div>
    );
  }
}

export default Home;