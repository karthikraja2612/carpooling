import { useEffect, useState } from "react";
import api from "../api/axios";
import RideCard from "../components/RideCard";

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
  <div className="max-w-6xl mx-auto px-6 py-6">
    <h2 className="text-xl font-semibold mb-6">
      Available Rides
    </h2>

    <div className="grid grid-cols-[260px_1fr] gap-6">
      {/* FILTER PANEL */}
      <aside className="card flex flex-col gap-4">
        <h3 className="text-base font-semibold">
          Filter
        </h3>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-500">
            From
          </label>
          <input
            placeholder="From"
            value={fromText}
            onChange={(e) => setFromText(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-500">
            To
          </label>
          <input
            placeholder="To"
            value={toText}
            onChange={(e) => setToText(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm text-slate-500">
            Date
          </label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <button
          className="primary mt-2"
          onClick={fetchRides}
          disabled={!fromText && !toText && !date}
        >
          Search
        </button>
      </aside>

      {/* RESULTS */}
      <section className="flex flex-col gap-4">
        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}

        {rides.length === 0 && !error ? (
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="card skeleton skeleton-card"
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {rides.map((ride) => (
              <RideCard
                key={ride.id}
                ride={ride}
                onRequestSeat={requestSeat}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  </div>
);

}

export default RideList;
