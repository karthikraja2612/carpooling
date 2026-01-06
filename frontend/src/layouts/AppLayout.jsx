import { Outlet } from "react-router-dom";

function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
