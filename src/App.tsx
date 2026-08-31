import { useEffect, useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import { hasAdminToken, setAdminToken } from "./api";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Gateways from "./pages/Gateways";
import Jobs from "./pages/Jobs";
import Blocklist from "./pages/Blocklist";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";

function Login({ onLogin }: { onLogin: (token: string) => void }) {
  const [token, setToken] = useState("");
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>
      <div className="card" style={{ width: 360 }}>
        <h1 style={{ marginTop: 0 }}>SMS Gateway Admin</h1>
        <p className="label">Enter your admin secret to continue.</p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Admin secret"
          style={{ width: "100%", marginBottom: 12 }}
        />
        <button style={{ width: "100%" }} onClick={() => onLogin(token)}>
          Sign in
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(hasAdminToken());

  useEffect(() => {
    setAuthed(hasAdminToken());
  }, []);

  if (!authed) {
    return (
      <Login
        onLogin={(token) => {
          setAdminToken(token);
          setAuthed(true);
        }}
      />
    );
  }

  return (
    <BrowserRouter>
      <div className="layout">
        <nav className="sidebar">
          <h2>SMS Gateway</h2>
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>
          <NavLink to="/projects" className={({ isActive }) => (isActive ? "active" : "")}>
            Projects
          </NavLink>
          <NavLink to="/gateways" className={({ isActive }) => (isActive ? "active" : "")}>
            Gateways
          </NavLink>
          <NavLink to="/jobs" className={({ isActive }) => (isActive ? "active" : "")}>
            SMS Jobs
          </NavLink>
          <NavLink to="/blocklist" className={({ isActive }) => (isActive ? "active" : "")}>
            Blocked Numbers
          </NavLink>
          <NavLink to="/logs" className={({ isActive }) => (isActive ? "active" : "")}>
            Logs
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            Settings
          </NavLink>
        </nav>
        <div className="content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/gateways" element={<Gateways />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/blocklist" element={<Blocklist />} />
            <Route path="/logs" element={<Logs />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
