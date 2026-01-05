import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/auth/me").then((res) => setUser(res.data));
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
  <div className="max-w-6xl mx-auto px-6 py-8">
    {/* Header */}
    <div className="mb-10">
      <h2 className="text-2xl font-semibold mb-1">
        Welcome, {user.name}
      </h2>
      <p className="text-slate-500">
        Manage your rides and requests from here
      </p>
    </div>

    {/* Actions Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {(user.role === "driver" || user.role === "both") && (
        <>
          {/* Create Ride */}
          <div className="card flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Create a Ride
              </h3>
              <p className="text-slate-500 mb-4">
                Offer a ride and manage passenger requests.
              </p>
            </div>

            <button
              className="primary w-fit"
              onClick={() => navigate("/rides/new")}
            >
              Create Ride
            </button>
          </div>

          {/* My Rides */}
          <div className="card flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                My Rides
              </h3>
              <p className="text-slate-500 mb-4">
                View and manage the rides you’ve published.
              </p>
            </div>

            <button
              className="secondary w-fit"
              onClick={() => navigate("/rides/my")}
            >
              View My Rides
            </button>
          </div>
        </>
      )}

      {(user.role === "passenger" || user.role === "both") && (
        <>
          {/* Find Rides */}
          <div className="card flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                Find Rides
              </h3>
              <p className="text-slate-500 mb-4">
                Search available rides and send requests.
              </p>
            </div>

            <button
              className="secondary w-fit"
              onClick={() => navigate("/rides")}
            >
              Find Rides
            </button>
          </div>

          {/* My Requests */}
          <div className="card flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                My Requests
              </h3>
              <p className="text-slate-500 mb-4">
                Track the status of your ride requests.
              </p>
            </div>

            <button
              className="secondary w-fit"
              onClick={() => navigate("/requests/my")}
            >
              View My Requests
            </button>
          </div>
        </>
      )}
    </div>
  </div>
);
}

export default Dashboard;
