# SMS Gateway Admin Dashboard

A web dashboard for managing the self-hosted SMS Gateway platform.

Pages: Dashboard, Projects, API Keys, Gateways, SMS Jobs, Blocked Numbers,
Logs, and Settings.

## Stack

React + TypeScript + Vite + React Router. Styling is plain CSS (no UI kit).

## Run

```bash
npm install
npm run dev        # http://localhost:5173 (proxies /api to http://localhost:3000)
```

## Build

```bash
npm run build      # outputs to dist/
```

## Configuration

- `VITE_API_BASE` — optional API base URL (defaults to same origin). Set this
  when the dashboard is hosted separately from the API.
- On first load, enter the backend **admin secret** (`ADMIN_SECRET`). It is
  stored in the browser's `localStorage` and sent as `Authorization: Bearer`.
