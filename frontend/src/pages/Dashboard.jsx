import { useEffect, useState } from "react";
import api from "../api/axios";
import { logout } from "../auth/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/auth/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        logout();
        navigate("/login");
      });
  }, []);

  return (
    <div>
      <h2>Dashboard</h2>

      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Role: {user.role}</p>

          {user.role === "driver" || user.role === "both" ? (
            <div>
              <h3>Driver Actions</h3>
              <ul>
                <li>
                  <a href="/rides/new">Create Ride</a>
                </li>
                <li>
                  <a href="/rides/my">My Rides</a>
                </li>
              </ul>
            </div>
          ) : null}

          {user.role === "passenger" || user.role === "both" ? (
              <div>
                <h3>Passenger Actions</h3>
                <ul>
                  <li>
                    <a href="/rides">Find Rides</a>
                  </li>
                  <li>
                   <a href="/requests/my">My Requests</a>
                  </li>
                </ul>
              </div>
            ) : null}

          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );

}

export default Dashboard;
