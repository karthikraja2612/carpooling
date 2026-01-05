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
  <div className="max-w-5xl mx-auto px-6 py-6">
    {/* Header */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-1">
        My Rides
      </h2>
      <p className="text-sm text-slate-500">
        Manage the rides you’ve published
      </p>
    </div>

    {error && <p className="error mb-4">{error}</p>}

    {rides.length === 0 ? (
      <div className="empty-state">
        <p>You haven’t created any rides yet.</p>
        <span>Your published rides will appear here.</span>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {rides.map((ride) => (
          <div
            key={ride.id}
            className="card flex items-center justify-between gap-6"
          >
            {/* Left side */}
            <div className="flex flex-col gap-1 flex-1">
              <div className="ride-route">
                <strong>{ride.from_text}</strong>
                <span className="arrow">→</span>
                <strong>{ride.to_text}</strong>
              </div>

              <div className="ride-meta">
                <span>
                  {new Date(ride.date).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{ride.time}</span>
              </div>
            </div>

            {/* Right side */}
            <div className="flex flex-col items-end gap-2 min-w-[200px]">
              <div className={`status-badge ${ride.status}`}>
                {ride.status}
              </div>

              <div className="seats-info">
                Seats: {ride.seats_available} / {ride.seats_total}
              </div>

              <button
                className="secondary"
                onClick={() =>
                  navigate(`/rides/${ride.id}/requests`)
                }
              >
                View Requests
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);


}

export default MyRides;
