import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate=useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading]=useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleSwap=()=>{
    const temp=from;
     setFrom(to);
     setTo(temp);  
  }

  useEffect(() => {
  const closeAll = () => {
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  window.addEventListener("click", closeAll);
  return () => window.removeEventListener("click", closeAll);
}, []);


  useEffect(() => {
  api.get("/auth/me")
    .then((res) => {
      setUser(res.data);   // logged in
    })
    .catch(() => {
      setUser(null);       // not logged in
    })
    .finally(() => {
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <div className="dashboard-container">
      {/* 1. TOP NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
  {/* Hamburger Button */}
        <button
          className="hamburger-btn"
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen)}}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M3 6H21" stroke="#1D1B20" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 12H21" stroke="#1D1B20" strokeWidth="2" strokeLinecap="round"/>
            <path d="M3 18H21" stroke="#1D1B20" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

            <div
        className="user-trigger"
        onClick={(e) => {
  e.stopPropagation();
  setUserMenuOpen(!userMenuOpen);
}}
      >
        <img src="/user.png" alt="user" className="nav-icon-img" />

        {user ? (
          <span className="username">{user.name}</span>
        ) : (
          <div className="auth-links">
            <span className="auth-link" onClick={() => navigate("/login")}>
              Login
            </span>
            /
            <span className="auth-link" onClick={() => navigate("/register")}>
              Sign up
            </span>
          </div>
        )}
      </div>
        {user && userMenuOpen && (
  <div className="user-dropdown">
    <button
      className="menu-item logout-item"
      onClick={() => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
      }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16 17L21 12L16 7"
          stroke="#1D1B20"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21 12H9"
          stroke="#1D1B20"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M12 19H5C3.895 19 3 18.105 3 17V7C3 5.895 3.895 5 5 5H12"
          stroke="#1D1B20"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <span>Logout</span>
    </button>
  </div>
)}

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="hamburger-menu">
            <button className="menu-item">View Requests</button>
            <button className="menu-item">My Rides</button>
            <button className="menu-item">My Requests</button>
          </div>
        )}
      </div>
        <div className="nav-right">
          <div className="nav-icons">
            <button className="create-ride-btn"
            onClick={()=>{
              if(user){
                navigate("/rides/new");
              }else{
                navigate("/login");
              }
            }}
            >
              <span className="plus-circle">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 5V19" stroke="#1d6cff" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M5 12H19" stroke="#1d6cff" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </span>
              <span className="create-text">Create a ride</span>
            </button>
            <button className="icon-btn"><img src="/notification.png" alt="notify" /></button>
            <button className="icon-btn"><img src="/settings.png" alt="settings" /></button>
            <div className="location-pill">
              <svg width="20" height="24" viewBox="0 0 31 38" fill="none" xmlns="http://www.w3.org/2000/svg" className="nav-svg">
                <path 
                  d="M15.18 18.9749C16.2236 18.9749 17.117 18.6034 17.8602 17.8602C18.6034 17.117 18.9749 16.2236 18.9749 15.18C18.9749 14.1363 18.6034 13.2429 17.8602 12.4997C17.117 11.7566 16.2236 11.385 15.18 11.385C14.1363 11.385 13.2429 11.7566 12.4997 12.4997C11.7566 13.2429 11.385 14.1363 11.385 15.18C11.385 16.2236 11.7566 17.117 12.4997 17.8602C13.2429 18.6034 14.1363 18.9749 15.18 18.9749ZM15.18 37.9499C10.0883 33.6173 6.28545 29.593 3.77127 25.8771C1.25709 22.1612 0 18.7219 0 15.5595C0 10.8157 1.5259 7.03654 4.57771 4.22193C7.62951 1.40731 11.1636 0 15.18 0C19.1963 0 22.7304 1.40731 25.7822 4.22193C28.834 7.03654 30.3599 10.8157 30.3599 15.5595C30.3599 18.7219 29.1028 22.1612 26.5886 25.8771C24.0745 29.593 20.2716 33.6173 15.18 37.9499Z" 
                  fill="#1D1B20"
                />
              </svg>
              <span>Location</span>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="illustration-circle">
            <img src="/newcar.png" alt="Car Illustration" />
          </div>

          <div className="search-card">
            {/* From Input */}
            <div className="input-group">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="input-svg">
                <path d="M6 19V20C6 20.2833 5.90417 20.5208 5.7125 20.7125C5.52083 20.9042 5.28333 21 5 21H4C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5208 3 20.2833 3 20V12L5.1 6C5.2 5.7 5.37917 5.45833 5.6375 5.275C5.89583 5.09167 6.18333 5 6.5 5H17.5C17.8167 5 18.1042 5.09167 18.3625 5.275C18.6208 5.45833 18.8 5.7 18.9 6L21 12V20C21 20.2833 20.9042 20.5208 20.7125 20.7125C20.5208 20.9042 20.2833 21 20 21H19C18.7167 21 18.4792 20.9042 18.2875 20.7125C18.0958 20.5208 18 20.2833 18 20V19H6ZM5.8 10H18.2L17.15 7H6.85L5.8 10ZM7.5 16C7.91667 16 8.27083 15.8542 8.5625 15.5625C8.85417 15.2708 9 14.9167 9 14.5C9 14.0833 8.85417 13.7292 8.5625 13.4375C8.27083 13.1458 7.91667 13 7.5 13C7.08333 13 6.72917 13.1458 6.4375 13.4375C6.14583 13.7292 6 14.0833 6 14.5C6 14.9167 6.14583 15.2708 6.4375 15.5625C6.72917 15.8542 7.08333 16 7.5 16ZM16.5 16C16.9167 16 17.2708 15.8542 17.5625 15.5625C17.8542 15.2708 18 14.9167 18 14.5C18 14.0833 17.8542 13.7292 17.5625 13.4375C17.2708 13.1458 16.9167 13 16.5 13C16.0833 13 15.7292 13.1458 15.4375 13.4375C15.1458 13.7292 15 14.0833 15 14.5C15 14.9167 15.1458 15.2708 15.4375 15.5625C15.7292 15.8542 16.0833 16 16.5 16ZM5 17H19V12H5V17Z" fill="#1D1B20"/>
              </svg>
              <input type="text" placeholder="From" value={from} onChange={(e)=>setFrom(e.target.value)}/>
            </div>
            
            {/* The Divider with Swap Button */}
            <div className="input-divider">
                <button className="swap-btn-circular" onClick={(e)=>{
                  e.stopPropagation();
                  handleSwap();
                }}>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 4L3 8L7 12"
                      stroke="#1D1B20"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 8H17"
                      stroke="#1D1B20"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17 20L21 16L17 12"
                      stroke="#1D1B20"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M21 16H7"
                      stroke="#1D1B20"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            {/* To Input */}
                <div className="input-group">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="input-svg">
                      <path d="M6 19V20C6 20.2833 5.90417 20.5208 5.7125 20.7125C5.52083 20.9042 5.28333 21 5 21H4C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5208 3 20.2833 3 20V12L5.1 6C5.2 5.7 5.37917 5.45833 5.6375 5.275C5.89583 5.09167 6.18333 5 6.5 5H17.5C17.8167 5 18.1042 5.09167 18.3625 5.275C18.6208 5.45833 18.8 5.7 18.9 6L21 12V20C21 20.2833 20.9042 20.5208 20.7125 20.7125C20.5208 20.9042 20.2833 21 20 21H19C18.7167 21 18.4792 20.9042 18.2875 20.7125C18.0958 20.5208 18 20.2833 18 20V19H6ZM5.8 10H18.2L17.15 7H6.85L5.8 10ZM7.5 16C7.91667 16 8.27083 15.8542 8.5625 15.5625C8.85417 15.2708 9 14.9167 9 14.5C9 14.0833 8.85417 13.7292 8.5625 13.4375C8.27083 13.1458 7.91667 13 7.5 13C7.08333 13 6.72917 13.1458 6.4375 13.4375C6.14583 13.7292 6 14.0833 6 14.5C6 14.9167 6.14583 15.2708 6.4375 15.5625C6.72917 15.8542 7.08333 16 7.5 16ZM16.5 16C16.9167 16 17.2708 15.8542 17.5625 15.5625C17.8542 15.2708 18 14.9167 18 14.5C18 14.0833 17.8542 13.7292 17.5625 13.4375C17.2708 13.1458 16.9167 13 16.5 13C16.0833 13 15.7292 13.1458 15.4375 13.4375C15.1458 13.7292 15 14.0833 15 14.5C15 14.9167 15.1458 15.2708 15.4375 15.5625C15.7292 15.8542 16.0833 16 16.5 16ZM5 17H19V12H5V17Z" fill="#1D1B20"/>
                    </svg>
                    <input type="text" placeholder="To" value={to} onChange={(e)=>setTo(e.target.value)}/>
                  </div>
            {/* Divider between To and Date */}
              <div className="input-divider"></div>
            {/* Date Input */}
            <div className="input-group bottom date-group">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="input-svg calendar-icon"
                onClick={(e) => {
                  e.currentTarget.nextSibling.showPicker();
                }}
              >
                <path
                  d="M7 2V5M17 2V5M3 9H21M5 5H19C20.1046 5 21 5.89543 21 7V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7C3 5.89543 3.89543 5 5 5Z"
                  stroke="#1D1B20"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <input
                type="date"
                className="date-input"
              />
            </div>
            {/* Search Button */}
            <button className="search-btn">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="search-icon"
              >
                <path
                  d="M10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5C18 12.2837 17.3679 13.9171 16.3125 15.1925L21 19.8799L19.8799 21L15.1925 16.3125C13.9171 17.3679 12.2837 18 10.5 18ZM10.5 5C7.46243 5 5 7.46243 5 10.5C5 13.5376 7.46243 16 10.5 16C13.5376 16 16 13.5376 16 10.5C16 7.46243 13.5376 5 10.5 5Z"
                  fill="#1D1B20"
                />
              </svg>
              <span>Search</span>
            </button>
          </div>
        </div>
      </section>

      {/* 3. RIDES SECTION */}
      <section className="rides-section">
        <h3 className="section-title">Rides nearby:</h3>
        <div className="rides-grid">
          {[1, 2, 3].map((_, i) => (
            <div className="ride-card" key={i}>
              <div className="ride-header">
                <div className="time-display">
                    <span className="main-time">23:30</span>
                    <span className="sub-time">04:40</span>
                </div>
                <div className="route-display">
                    <div className="dot"></div>
                    <span className="city-name">Karachi</span>
                    <div className="connector-line"></div>
                    <div className="dot"></div>
                    <span className="city-name">Hyderabad</span>
                </div>
                <div className="price-tag">Rs. 500</div>
              </div>

              <div className="driver-bar">
                <div className="driver-avatar-circle">
                    <img src="/user.png" alt="driver" />
                </div>
                <div className="driver-details">
                  <p className="d-name">Ahmed Ali</p>
                  <p className="d-eta">10 mins away</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Dashboard;