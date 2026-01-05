import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { logout } from "../auth/auth";

function RideRequests() {
  const { rideId } = useParams();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchRequests = () => {
    setLoading(true);
    api
      .get(`/requests/ride/${rideId}`)
      .then((res) => {
        setRequests(res.data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          logout();
          navigate("/login");
        } else if (err.response?.status === 403) {
          setError("You are not allowed to view these requests");
          setLoading(false);
        } else {
          setError("Failed to load requests");
          setLoading(false);
        }
      });
  };

  useEffect(() => {
    fetchRequests();
  }, [rideId]);

  const acceptRequest = async (requestId) => {
    setError("");
    setMessage("");
    setActionLoading(true);

    try {
      await api.post(`/requests/${requestId}/accept`);
      setMessage("Request accepted");
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.detail || "Accept failed");
    } finally {
      setActionLoading(false);
    }
  };

  const rejectRequest = async (requestId) => {
    setError("");
    setMessage("");
    setActionLoading(true);

    try {
      await api.post(`/requests/${requestId}/reject`);
      setMessage("Request rejected");
      fetchRequests();
    } catch (err) {
      setError(err.response?.data?.detail || "Reject failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <p>Loading requests...</p>;

  return (
    <div>
      <h2>Ride Requests</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

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
              <strong>Passenger:</strong> {req.passenger_id}
            </p>
            <p>
              <strong>Status:</strong> {req.status}
            </p>

            {req.status === "pending" && (
              <>
                <button
                  onClick={() => acceptRequest(req.id)}
                  disabled={actionLoading}
                >
                  Accept
                </button>

                <button
                  onClick={() => rejectRequest(req.id)}
                  disabled={actionLoading}
                  style={{ marginLeft: "10px" }}
                >
                  Reject
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default RideRequests;
