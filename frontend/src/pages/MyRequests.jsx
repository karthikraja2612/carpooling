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

  const statusStyle = (status) => {
    switch (status) {
      case "accepted":
        return { color: "green", fontWeight: "bold" };
      case "rejected":
        return { color: "red", fontWeight: "bold" };
      case "pending":
        return { color: "#d97706", fontWeight: "bold" };
      default:
        return {};
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>My Ride Requests</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {requests.length === 0 ? (
        <p style={{ color: "#555" }}>
          You haven’t requested any rides yet.
        </p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "6px",
              padding: "12px",
              marginBottom: "12px",
              backgroundColor: "#fafafa",
            }}
          >
            <p style={{ fontSize: "16px", marginBottom: "6px" }}>
              <strong>{req.from_text}</strong> →{" "}
              <strong>{req.to_text}</strong>
            </p>

            <p style={{ margin: "4px 0" }}>
              📅 {new Date(req.date).toLocaleDateString()} | ⏰ {req.time}
            </p>

            <p style={{ marginTop: "6px" }}>
              Status:{" "}
              <span style={statusStyle(req.status)}>
                {req.status.toUpperCase()}
              </span>
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default MyRequests;
