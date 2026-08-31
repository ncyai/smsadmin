import { useEffect, useState } from "react";
import { api } from "../api";
import type { BlockedNumber } from "../types";

export default function Blocklist() {
  const [numbers, setNumbers] = useState<BlockedNumber[]>([]);
  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [reason, setReason] = useState("");

  const load = () =>
    api
      .blocklist()
      .then((r) => setNumbers(r.numbers))
      .catch((e) => setError(String(e)));

  useEffect(() => {
    load();
  }, []);

  async function add() {
    if (!phone.trim()) return;
    await api.addBlocked(phone.trim(), reason.trim());
    setPhone("");
    setReason("");
    load();
  }

  async function remove(p: string) {
    await api.removeBlocked(p);
    load();
  }

  return (
    <div>
      <h1>Blocked Numbers</h1>
      {error && <div className="error">{error}</div>}
      <div className="row" style={{ marginBottom: 16 }}>
        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+959..." />
        <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Reason" />
        <button onClick={add}>Block</button>
      </div>
      <table>
        <thead>
          <tr>
            <th>Phone</th>
            <th>Reason</th>
            <th>Created</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {numbers.map((n) => (
            <tr key={n.phone}>
              <td className="mono">{n.phone}</td>
              <td>{n.reason || "—"}</td>
              <td>{new Date(n.created_at).toLocaleString()}</td>
              <td>
                <button className="danger" onClick={() => remove(n.phone)}>
                  Unblock
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
