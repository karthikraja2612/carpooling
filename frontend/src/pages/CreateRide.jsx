import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function CreateRide() {
  const navigate = useNavigate();

  const [fromText, setFromText] = useState("");
  const [toText, setToText] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [seats, setSeats] = useState(1);
  const [price, setPrice] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/rides/", {
        from_text: fromText,
        to_text: toText,
        from_lat: 0,
        from_lng: 0,
        to_lat: 0,
        to_lng: 0,
        date,
        time,
        seats_total: Number(seats),
        price_per_seat: price > 0 ? Number(price) : null,
    });


      navigate("/dashboard");
    } catch (err) {
      console.log("Create ride error:", err.response);

      const detail = err.response?.data?.detail;

      if (Array.isArray(detail)) {
        setError(detail[0]?.msg || "Validation error");
      } else if (typeof detail === "string") {
        setError(detail);
      } else {
        setError("Failed to create ride");
      }
    }
  }

  return (
    <div>
      <h2>Create Ride</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          placeholder="From"
          value={fromText}
          onChange={(e) => setFromText(e.target.value)}
          required
        />

        <br />

        <input
          placeholder="To"
          value={toText}
          onChange={(e) => setToText(e.target.value)}
          required
        />

        <br />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <br />

        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
        />

        <br />

        <input
          type="number"
          min="1"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          required
        />

        <br />

        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        <br />

        <button type="submit">Create Ride</button>
      </form>
    </div>
  );
}

export default CreateRide;
