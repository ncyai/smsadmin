import { useEffect, useState } from "react";
import { api } from "../api";
import type { Job } from "../types";

export default function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .jobs()
      .then((r) => setJobs(r.jobs))
      .catch((e) => setError(String(e)));
  }, []);

  function badge(s: string) {
    if (s === "SENT") return <span className="badge green">SENT</span>;
    if (s === "FAILED") return <span className="badge red">FAILED</span>;
    if (s === "PROCESSING") return <span className="badge yellow">PROCESSING</span>;
    if (s === "EXPIRED") return <span className="badge gray">EXPIRED</span>;
    return <span className="badge gray">{s}</span>;
  }

  return (
    <div>
      <h1>SMS Jobs</h1>
      {error && <div className="error">{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Job ID</th>
            <th>Destination</th>
            <th>Status</th>
            <th>Attempts</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id}>
              <td className="mono">{j.id}</td>
              <td className="mono">{j.to}</td>
              <td>{badge(j.status)}</td>
              <td>{j.attempts}</td>
              <td>{new Date(j.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
