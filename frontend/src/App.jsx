import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
// import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateRide from "./pages/CreateRide";
import MyRides from "./pages/MyRides";
import SearchRides from "./pages/SearchRides";
import RideList from "./pages/RideList";
import RideRequests from "./pages/RideRequests";
import MyRequests from "./pages/MyRequests";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route path="/rides/new" element={<CreateRide />} />
        <Route path="/rides" element={<RideList />} />
        <Route path="/rides/my" element={<MyRides />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/rides/search" element={<SearchRides />} />
        <Route path="/rides/:rideId/requests" element={<RideRequests/>}/>
        <Route path="/requests/my" element={<MyRequests />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
