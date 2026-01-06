import { useEffect, useState } from "react";
import "./Dashboard.css";

function Dashboard() {
  const [user, setUser] = useState({ name: "username" });

  return (
    <div className="dashboard-container">
      {/* 1. TOP NAVBAR */}
      <nav className="navbar">
        <div className="nav-left">
          <img src="/user.png" alt="user" className="nav-icon-img" />
          <span className="username">{user.name}</span>
        </div>
        <div className="nav-right">
          <div className="nav-icons">
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
              <input type="text" placeholder="From" />
            </div>
            
            {/* The Divider with Swap Button */}
            <div className="input-divider">
                <button className="swap-btn-circular">
                  <svg width="20" height="20" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path 
                      d="M16.9148 27.4864V12.316L11.4703 17.7604L8.4574 14.8004L19.0291 4.22864L29.6009 14.8004L26.5879 17.7604L21.1435 12.316V27.4864H16.9148ZM31.7152 46.5155L21.1435 35.9438L24.1564 32.9837L29.6009 38.4282V23.2577H33.8295V38.4282L39.274 32.9837L42.2869 35.9438L31.7152 46.5155Z" 
                      fill="#1D1B20"
                    />
                  </svg>
                </button>
              </div>
            {/* To Input */}
                <div className="input-group">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="input-svg">
                      <path d="M6 19V20C6 20.2833 5.90417 20.5208 5.7125 20.7125C5.52083 20.9042 5.28333 21 5 21H4C3.71667 21 3.47917 20.9042 3.2875 20.7125C3.09583 20.5208 3 20.2833 3 20V12L5.1 6C5.2 5.7 5.37917 5.45833 5.6375 5.275C5.89583 5.09167 6.18333 5 6.5 5H17.5C17.8167 5 18.1042 5.09167 18.3625 5.275C18.6208 5.45833 18.8 5.7 18.9 6L21 12V20C21 20.2833 20.9042 20.5208 20.7125 20.7125C20.5208 20.9042 20.2833 21 20 21H19C18.7167 21 18.4792 20.9042 18.2875 20.7125C18.0958 20.5208 18 20.2833 18 20V19H6ZM5.8 10H18.2L17.15 7H6.85L5.8 10ZM7.5 16C7.91667 16 8.27083 15.8542 8.5625 15.5625C8.85417 15.2708 9 14.9167 9 14.5C9 14.0833 8.85417 13.7292 8.5625 13.4375C8.27083 13.1458 7.91667 13 7.5 13C7.08333 13 6.72917 13.1458 6.4375 13.4375C6.14583 13.7292 6 14.0833 6 14.5C6 14.9167 6.14583 15.2708 6.4375 15.5625C6.72917 15.8542 7.08333 16 7.5 16ZM16.5 16C16.9167 16 17.2708 15.8542 17.5625 15.5625C17.8542 15.2708 18 14.9167 18 14.5C18 14.0833 17.8542 13.7292 17.5625 13.4375C17.2708 13.1458 16.9167 13 16.5 13C16.0833 13 15.7292 13.1458 15.4375 13.4375C15.1458 13.7292 15 14.0833 15 14.5C15 14.9167 15.1458 15.2708 15.4375 15.5625C15.7292 15.8542 16.0833 16 16.5 16ZM5 17H19V12H5V17Z" fill="#1D1B20"/>
                    </svg>
                    <input type="text" placeholder="To" />
                  </div>

            {/* Date Input */}
            <div className="input-group bottom">
              <img src="/notification.png" alt="date" className="input-icon-img" />
              <input type="text" placeholder="Today's date" onFocus={(e) => e.target.type = 'date'} />
            </div>
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