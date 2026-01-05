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
  <div className="max-w-4xl mx-auto px-6 py-6">
    {/* Header */}
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-1">
        Ride Requests
      </h2>
      <p className="text-sm text-slate-500">
        Review and manage passenger requests
      </p>
    </div>

    {/* Feedback */}
    {error && <p className="error mb-4">{error}</p>}
    {message && <p className="success mb-4">{message}</p>}

    {/* Empty / List */}
    {requests.length === 0 ? (
      <div className="empty-state">
        <p>No requests yet</p>
        <span>Passenger requests will appear here.</span>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        {requests.map((req) => (
          <div
            key={req.id}
            className="card flex items-center justify-between gap-6"
          >
            {/* Left */}
            <div className="flex flex-col gap-1">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Passenger ID
              </span>

              <span className="font-semibold">
                {req.passenger_id}
              </span>

              <span className={`status-badge ${req.status}`}>
                {req.status}
              </span>
            </div>

            {/* Actions */}
            {req.status === "pending" && (
              <div className="flex gap-2">
                <button
                  className="primary"
                  onClick={() => acceptRequest(req.id)}
                  disabled={actionLoading}
                >
                  Accept
                </button>

                <button
                  className="ghost"
                  onClick={() => rejectRequest(req.id)}
                  disabled={actionLoading}
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);

}

export default RideRequests;
