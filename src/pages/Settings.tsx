import { useState } from "react";
import { api, setAdminToken } from "../api";

export default function Settings() {
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function saveToken() {
    if (!token.trim()) return;
    setAdminToken(token.trim());
    setToken("");
    setMessage("Admin secret updated.");
  }

  async function runMaintenance() {
    setMessage("Running maintenance…");
    try {
      const r = await api.maintenance();
      setMessage(`Maintenance complete: ${JSON.stringify(r)}`);
    } catch (e) {
      setError(String(e));
    }
  }

  return (
    <div>
      <h1>Settings</h1>
      <div className="card" style={{ maxWidth: 480, marginBottom: 16 }}>
        <h3>Admin Secret</h3>
        <p className="label">The admin secret is stored in this browser's localStorage.</p>
        <input
          type="password"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="New admin secret"
          style={{ width: "100%", marginBottom: 8 }}
        />
        <button onClick={saveToken}>Save</button>
      </div>

      <div className="card" style={{ maxWidth: 480 }}>
        <h3>Maintenance</h3>
        <p className="label">
          Requeues expired jobs, expires stale queued jobs, marks offline gateways, and purges
          old data per the retention configuration.
        </p>
        <button className="secondary" onClick={runMaintenance}>
          Run Maintenance
        </button>
        {message && <p className="notice">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
