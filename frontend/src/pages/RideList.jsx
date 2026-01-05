import { useEffect, useState } from "react";
import api from "../api/axios";

function RideList() {
  const [rides, setRides] = useState([]);
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchRides = async () => {
    setError("");
    try {
      const params = {};

      if (fromText) params.from_text = fromText;
      if (toText) params.to_text = toText;
      if (date) params.date = date;

      const res = await api.get("/rides", { params });
      setRides(res.data);
    } catch {
      setError("Failed to load rides");
    }
  };

  // Load all rides on first render
  useEffect(() => {
    fetchRides();
  }, []);

  const requestSeat = async (rideId) => {
    setError("");
    setMessage("");

    try {
      await api.post(`/requests/ride/${rideId}`);
      setMessage("Seat request sent");
    } catch (err) {
      setError(err.response?.data?.detail || "Request failed");
    }
  };

  return (
    <div>
      <h2>Available Rides</h2>

      {/* SEARCH CONTROLS */}
      <div style={{ marginBottom: "15px" }}>
        <input
          placeholder="From"
          value={fromText}
          onChange={(e) => setFromText(e.target.value)}
        />

        <input
          placeholder="To"
          value={toText}
          onChange={(e) => setToText(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button onClick={fetchRides}>Search</button>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      {rides.length === 0 ? (
        <p>No rides available</p>
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
            <p>Date: {ride.date}</p>
            <p>Time: {ride.time}</p>
            <p>Seats available: {ride.seats_available}</p>

            {ride.seats_available > 0 && ride.status === "open" && (
              <button onClick={() => requestSeat(ride.id)}>
                Request Seat
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RideList;
