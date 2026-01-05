import { useEffect, useState } from "react";
import api from "../api/axios";

function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/requests/my")
      .then((res) => setRequests(res.data))
      .catch(() => setError("Failed to load requests"));
  }, []);

  return (
    <div>
      <h2>My Ride Requests</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {requests.length === 0 ? (
        <p>No requests yet</p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
            }}
          >
            <p>
              <strong>{req.from_text}</strong> →{" "}
              <strong>{req.to_text}</strong>
            </p>
            <p>Date: {req.date}</p>
            <p>Time: {req.time}</p>
            <p>Status: {req.status}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;
