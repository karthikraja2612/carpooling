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
  <div className="max-w-3xl mx-auto px-6 py-6">
    {/* Header */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-1">
        Create a Ride
      </h2>
      <p className="text-sm text-slate-500">
        Share your trip and offer seats to others
      </p>
    </div>

    {error && <p className="error mb-4">{error}</p>}

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8"
    >
      {/* Route */}
      <section>
        <h3 className="text-base font-semibold mb-3">
          Route
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="From"
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
            required
          />
          <input
            placeholder="To"
            value={toText}
            onChange={(e) => setToText(e.target.value)}
            required
          />
        </div>
      </section>

      {/* Schedule */}
      <section>
        <h3 className="text-base font-semibold mb-3">
          Schedule
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
        </div>
      </section>

      {/* Capacity */}
      <section>
        <h3 className="text-base font-semibold mb-3">
          Capacity
        </h3>
        <div className="grid grid-cols-[140px_180px] gap-4">
          <input
            type="number"
            min="1"
            value={seats}
            onChange={(e) => setSeats(e.target.value)}
            required
          />
          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Price (optional)"
          />
        </div>
      </section>

      {/* Action */}
      <div>
        <button className="primary px-6 py-3" type="submit">
          Publish Ride
        </button>
      </div>
    </form>
  </div>
);


}

export default CreateRide;
