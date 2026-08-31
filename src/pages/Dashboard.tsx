import { useEffect, useState } from "react";
import { api } from "../api";
import type { Stats } from "../types";

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .stats()
      .then((s) => setStats(s))
      .catch((e) => setError(String(e)));
  }, []);

  if (error) return <div className="error">{error}</div>;
  if (!stats) return <p>Loading…</p>;

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="cards">
        <Metric label="SMS Today" value={stats.sms_today} />
        <Metric label="Successful SMS" value={stats.sms_sent} />
        <Metric label="Failed SMS" value={stats.sms_failed} />
        <Metric label="Queued Jobs" value={stats.queued_jobs} />
        <Metric label="Processing" value={stats.processing_jobs} />
        <Metric label="Online Gateways" value={stats.online_gateways} />
        <Metric label="Offline Gateways" value={stats.offline_gateways} />
        <Metric label="Active Projects" value={stats.active_projects} />
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}
