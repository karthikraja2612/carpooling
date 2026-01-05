import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { logout } from "../auth/auth";

function MyRides() {
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get("/rides/my")
      .then((res) => {
        setRides(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else {
          setError("Failed to load your rides");
          setLoading(false);
        }
      });
  }, [navigate]);

  if (loading) return <p>Loading your rides...</p>;

  return (
    <div>
      <h2>My Rides</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {rides.length === 0 ? (
        <p>You haven’t created any rides yet.</p>
      ) : (
        rides.map((ride) => (
          <div
            key={ride.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>{ride.from_text}</strong> →{" "}
              <strong>{ride.to_text}</strong>
            </p>

            <p>
              Date: {new Date(ride.date).toLocaleDateString()}
            </p>

            <p>Time: {ride.time}</p>
            <p>Status: {ride.status}</p>

            <p>
              Seats: {ride.seats_available} / {ride.seats_total}
            </p>

            <button
              onClick={() => navigate(`/rides/${ride.id}/requests`)}
            >
              View Requests
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRides;
