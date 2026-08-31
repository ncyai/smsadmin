import { useEffect, useState } from "react";
import { api } from "../api";
import type { AuditLog } from "../types";

export default function Logs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .logs()
      .then((r) => setLogs(r.logs))
      .catch((e) => setError(String(e)));
  }, []);

  return (
    <div>
      <h1>Audit Logs</h1>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Event</th>
            <th>Project</th>
            <th>Gateway</th>
            <th>Job</th>
            <th>Phone</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((l) => (
            <tr key={l.id}>
              <td>{l.event}</td>
              <td className="mono">{l.project_id ?? "—"}</td>
              <td className="mono">{l.gateway_id ?? "—"}</td>
              <td className="mono">{l.job_id ?? "—"}</td>
              <td className="mono">{l.phone_masked ?? "—"}</td>
              <td>{new Date(l.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
