import { useEffect, useState } from "react";
import { api } from "../api";
import type { Gateway } from "../types";

export default function Gateways() {
  const [gateways, setGateways] = useState<Gateway[]>([]);
  const [error, setError] = useState("");

  const load = () =>
    api
      .gateways()
      .then((r) => setGateways(r.gateways))
      .catch((e) => setError(String(e)));

  useEffect(() => {
    load();
  }, []);

  function statusBadge(s: string) {
    if (s === "ONLINE") return <span className="badge green">ONLINE</span>;
    if (s === "DISABLED") return <span className="badge gray">DISABLED</span>;
    if (s === "SIM_UNAVAILABLE") return <span className="badge yellow">SIM UNAVAILABLE</span>;
    return <span className="badge red">OFFLINE</span>;
  }

  async function setStatus(g: Gateway, status: string) {
    await api.setGatewayStatus(g.id, status);
    load();
  }

  return (
    <div>
      <h1>Gateways</h1>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Gateway ID</th>
            <th>Status</th>
            <th>Battery</th>
            <th>Network</th>
            <th>Last Seen</th>
            <th>Sent</th>
            <th>Failed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {gateways.map((g) => (
            <tr key={g.id}>
              <td>{g.name}</td>
              <td className="mono">{g.id}</td>
              <td>{statusBadge(g.status)}</td>
              <td>{g.battery_level != null ? `${g.battery_level}%` : "—"}</td>
              <td>{g.network_type ?? "—"}</td>
              <td>{g.last_seen_at ? new Date(g.last_seen_at).toLocaleString() : "—"}</td>
              <td>{g.sent_count ?? 0}</td>
              <td>{g.failed_count ?? 0}</td>
              <td>
                <div className="row">
                  {g.status === "DISABLED" ? (
                    <button className="secondary" onClick={() => setStatus(g, "ONLINE")}>
                      Enable
                    </button>
                  ) : (
                    <button className="danger" onClick={() => setStatus(g, "DISABLED")}>
                      Disable
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
