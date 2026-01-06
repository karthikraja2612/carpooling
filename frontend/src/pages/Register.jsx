import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState("passenger");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
        phone,
        role,
      });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    }
  };

  return (
    <div className="register-page">
      <Link to="/login" className="login-link">
        → Login
      </Link>

      <div className="register-card">
        <img
          src="/car.png"
          alt="car"
          className="register-icon"
        />

        <form onSubmit={handleRegister}>
          {error && <p className="error-text">{error}</p>}

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="passenger">Passenger</option>
            <option value="driver">Driver</option>
            <option value="both">Both</option>
          </select>

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import api from "../api/axios";

// function Register() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phone, setPhone] = useState("");
//   const [role, setRole] = useState("passenger");
//   const [error, setError] = useState("");

//   const handleRegister = async (e) => {
//     e.preventDefault();
//     setError("");

//     try {
//       await api.post("/auth/register", {
//         name,
//         email,
//         password,
//         phone,
//         role,
//       });
//       navigate("/login");
//     } catch (err) {
//       setError(err.response?.data?.detail || "Registration failed");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#c9f0ff] flex items-center justify-center">
//       {/* Outer container */}
//       <div className="w-[420px] border-2 border-blue-500 p-6 overflow-hidden">
        
//         {/* Image wrapper */}
//         <div className="flex justify-center mb-4">
//           <div className="bg-white p-3 rounded">
//             <img
//               src="/car.png"
//               alt="car"
//               className="w-24 h-auto object-contain"
//             />
//           </div>
//         </div>

//         <form onSubmit={handleRegister} className="space-y-3">
//           <input
//             placeholder="Name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             className="w-full border rounded-xl px-4 py-2 outline-none"
//             required
//           />

//           <input
//             type="email"
//             placeholder="Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             className="w-full border rounded-xl px-4 py-2 outline-none"
//             required
//           />

//           {/* Login link INSIDE */}
//           <div className="text-center text-blue-600 text-sm">
//             <Link to="/login">→ Login</Link>
//           </div>

//           <input
//             type="password"
//             placeholder="Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             className="w-full border rounded-xl px-4 py-2 outline-none"
//             required
//           />

//           <input
//             placeholder="Phone"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             className="w-full border rounded-xl px-4 py-2 outline-none"
//             required
//           />

//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="w-full border px-2 py-1"
//           >
//             <option value="passenger">Passenger</option>
//             <option value="driver">Driver</option>
//             <option value="both">Both</option>
//           </select>

//           <button
//             type="submit"
//             className="w-full bg-[#9ecbff] py-2 text-white"
//           >
//             Register
//           </button>

//           {error && (
//             <p className="text-center text-red-500 text-sm">
//               {error}
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;
