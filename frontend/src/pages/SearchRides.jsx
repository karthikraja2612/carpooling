import { useState } from "react";
import api from "../api/axios";

function SearchRides() {
  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [date, setDate] = useState("");
  const [rides, setRides] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.get("/rides", {
        params: {
          from_text: fromText || undefined,
          to_text: toText || undefined,
          date: date || undefined,
        },
      });

      setRides(res.data);
    } catch (err) {
      setError("Failed to fetch rides");
    }
  };

  return (
    <div>
      <h2>Search Rides</h2>

      <form onSubmit={handleSearch}>
        <input
          placeholder="From"
          value={fromText}
          onChange={(e) => setFromText(e.target.value)}
        />

        <br />

        <input
          placeholder="To"
          value={toText}
          onChange={(e) => setToText(e.target.value)}
        />

        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <br />

        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <hr />

      {rides.length === 0 ? (
        <p>No rides found</p>
      ) : (
        rides.map((ride) => (
          <div key={ride.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <p><strong>{ride.from_text}</strong> → <strong>{ride.to_text}</strong></p>
            <p>Date: {ride.date}</p>
            <p>Time: {ride.time}</p>
            <p>Seats available: {ride.seats_available}</p>
            <p>Price: {ride.price_per_seat ?? "Free"}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default SearchRides;
