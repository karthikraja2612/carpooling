import { Outlet, useNavigate } from "react-router-dom";
import { logout } from "../auth/auth";

function AppLayout() {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen flex flex-col">
    {/* Header */}
    <header className="bg-white border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <h1
          className="logo cursor-pointer text-lg font-semibold"
          onClick={() => navigate("/dashboard")}
        >
          RideFlow
        </h1>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          <button
            className="secondary"
            onClick={() => navigate("/rides/new")}
          >
            Create Ride
          </button>

          <button
            className="secondary"
            onClick={() => navigate("/rides")}
          >
            Find Rides
          </button>

          <button
            className="logout-ghost"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            Logout
          </button>
        </nav>
      </div>
    </header>

    {/* Main content */}
    <main className="flex-1 bg-[var(--bg)]">
      <Outlet />
    </main>
  </div>
);

}

export default AppLayout;
