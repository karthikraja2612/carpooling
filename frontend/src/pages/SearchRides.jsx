import { useState } from "react";
import api from "../api/axios";
import RideCard from "../components/RideCard";

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
    } catch {
      setError("Failed to fetch rides");
    }
  };

  return (
    <div className="container">
      <h2>Search Rides</h2>

      <form className="search-bar" onSubmit={handleSearch}>
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
        <button type="submit">Search</button>
      </form>

      {error && <p className="error">{error}</p>}

      <div className="ride-list">
        {rides.map((ride) => (
          <RideCard key={ride.id} ride={ride} />
        ))}
      </div>
    </div>
  );
}

export default SearchRides;
