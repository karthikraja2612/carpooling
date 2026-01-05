import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me").then((res) => setUser(res.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="container">
      <div className="dashboard-header">
        <h2>Welcome, {user.name}</h2>
        <p className="muted">
          Manage your rides and requests from here
        </p>
      </div>

      <div className="dashboard-grid">
        {(user.role === "driver" || user.role === "both") && (
          <div className="card action-card">
            <h3>Create a Ride</h3>
            <p>Offer a ride and manage passenger requests.</p>
            <button onClick={() => navigate("/rides/new")}>
              Create Ride
            </button>
          </div>
        )}

        {(user.role === "passenger" || user.role === "both") && (
          <div className="card action-card">
            <h3>Find Rides</h3>
            <p>Search available rides and send requests.</p>
            <button
              className="secondary"
              onClick={() => navigate("/rides")}
            >
              Find Rides
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
