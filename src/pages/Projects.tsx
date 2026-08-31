import { useEffect, useState } from "react";
import { api } from "../api";
import type { ApiKey, Project } from "../types";

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const load = () =>
    api
      .projects()
      .then((r) => setProjects(r.projects))
      .catch((e) => setError(String(e)));

  useEffect(() => {
    load();
  }, []);

  async function create() {
    if (!name.trim()) return;
    await api.createProject({ name: name.trim() });
    setName("");
    load();
  }

  return (
    <div>
      <h1>Projects</h1>
      {error && <div className="error">{error}</div>}
      <div className="row" style={{ marginBottom: 16 }}>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Project name" />
        <button onClick={create}>Create Project</button>
      </div>

      {projects.map((p) => (
        <ProjectRow key={p.id} project={p} onChanged={load} />
      ))}
    </div>
  );
}

function ProjectRow({ project, onChanged }: { project: Project; onChanged: () => void }) {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [showKeys, setShowKeys] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [revealedKey, setRevealedKey] = useState<string | null>(null);

  useEffect(() => {
    if (showKeys) api.keys(project.id).then((r) => setKeys(r.keys));
  }, [showKeys, project.id]);

  async function toggleStatus() {
    await api.setProjectStatus(project.id, project.status === "ACTIVE" ? "DISABLED" : "ACTIVE");
    onChanged();
  }

  async function createKey() {
    if (!newKeyName.trim()) return;
    const r = await api.createKey(project.id, newKeyName.trim());
    setRevealedKey(r.api_key);
    setNewKeyName("");
    setShowKeys(true);
    api.keys(project.id).then((res) => setKeys(res.keys));
  }

  async function revoke(keyId: string) {
    await api.revokeKey(keyId);
    api.keys(project.id).then((res) => setKeys(res.keys));
  }

  return (
    <div className="card" style={{ marginBottom: 12 }}>
      <div className="row">
        <h3 style={{ margin: 0 }}>{project.name}</h3>
        <span className={`badge ${project.status === "ACTIVE" ? "green" : "gray"}`}>{project.status}</span>
        <div className="spacer" />
        <span className="label">
          Limits: {project.minute_limit}/min · {project.hourly_limit}/hr · {project.daily_limit}/day
        </span>
        <button className="secondary" onClick={() => setShowKeys(!showKeys)}>
          {showKeys ? "Hide Keys" : "API Keys"}
        </button>
        <button className={project.status === "ACTIVE" ? "danger" : "secondary"} onClick={toggleStatus}>
          {project.status === "ACTIVE" ? "Disable" : "Enable"}
        </button>
      </div>

      {revealedKey && (
        <div className="notice mono" style={{ marginTop: 12 }}>
          New API key (shown once): {revealedKey}
          <br />
          <button className="secondary" onClick={() => setRevealedKey(null)}>
            Dismiss
          </button>
        </div>
      )}

      {showKeys && (
        <div className="section">
          <div className="row" style={{ marginBottom: 8 }}>
            <input value={newKeyName} onChange={(e) => setNewKeyName(e.target.value)} placeholder="Key name" />
            <button onClick={createKey}>Create API Key</button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Prefix</th>
                <th>Status</th>
                <th>Last Used</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td>{k.name}</td>
                  <td className="mono">{k.prefix}…</td>
                  <td>
                    <span className={`badge ${k.status === "ACTIVE" ? "green" : "gray"}`}>{k.status}</span>
                  </td>
                  <td>{k.last_used_at ? new Date(k.last_used_at).toLocaleString() : "—"}</td>
                  <td>
                    {k.status === "ACTIVE" && (
                      <button className="danger" onClick={() => revoke(k.id)}>
                        Revoke
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
