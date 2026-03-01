// Strava.jsx
import React, { useEffect, useState } from "react";

export const Strava = () => {
  const [runs, setRuns] = useState([]);
  const [msg, setMsg] = useState("");
  const [connected, setConnected] = useState(false);

  const [name, setName] = useState("");
  const [distance, setDistance] = useState("");
  const [minutes, setMinutes] = useState("");
  const [start, setStart] = useState("");

  const backend = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");

  const getHeaders = (isJson = false) => {
    const h = { Authorization: "Bearer " + token };
    if (isJson) h["Content-Type"] = "application/json";
    return h;
  };

  const loadStatus = async () => {
    const res = await fetch(backend + "/strava/status", {
      headers: getHeaders(),
    });
    const data = await res.json();
    if (res.ok) setConnected(!!data.connected);
    else setMsg(data.msg || "Could not check Strava status.");
  };

  const connectStrava = async () => {
    setMsg("");
    const res = await fetch(backend + "/strava/login-url", {
      headers: getHeaders(),
    });
    const data = await res.json();

    if (!res.ok) return setMsg(data.msg || "Could not get Strava login URL.");
    if (!data.auth_url) return setMsg("No auth_url returned from backend.");

    window.location.assign(data.auth_url);
  };

  const loadRuns = async () => {
    const res = await fetch(backend + "/strava/runs", {
      headers: getHeaders(),
    });
    const data = await res.json();

    if (res.ok) setRuns(data);
    else setMsg(data.msg || "Could not load runs.");
  };

  const createRun = async (e) => {
    e.preventDefault();

    const res = await fetch(backend + "/strava/create-run", {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify({
        name,
        distance: Number(distance),
        elapsed_time: Number(minutes) * 60,
        start_date_local: new Date(start).toISOString(),
      }),
    });

    const data = await res.json();

    if (!res.ok) return setMsg(data.msg || "Failed to create run.");

    setMsg("Run created!");
    setName("");
    setDistance("");
    setMinutes("");
    setStart("");
    loadRuns();
  };

  useEffect(() => {
    if (!token) return;

    if (
      new URLSearchParams(window.location.search).get("connected") === "true"
    ) {
      setMsg("Strava connected!");
      window.history.replaceState({}, "", window.location.pathname);
    }

    loadStatus();
  }, []);

  useEffect(() => {
    if (connected) loadRuns();
  }, [connected]);

  if (!token) {
    return (
      <p>
        You need to <a href="/login">log in</a> first.
      </p>
    );
  }

  return (
    <div>
      <h3>Strava</h3>

      <button onClick={connectStrava}>Connect Strava</button>
      <button onClick={loadRuns} disabled={!connected}>
        Refresh
      </button>

      {!connected && <p>Not connected yet.</p>}
      {msg && <p>{msg}</p>}

      <h4>Log a Run</h4>
      {!connected ? (
        <p>Connect Strava to log runs.</p>
      ) : (
        <form onSubmit={createRun}>
          <div>
            <input
              placeholder="Run name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              placeholder="Distance (meters)"
              type="number"
              value={distance}
              onChange={(e) => setDistance(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              placeholder="Duration (minutes)"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="datetime-local"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              required
            />
          </div>
          <button type="submit">Save Run</button>
        </form>
      )}

      <h4>Recent Runs</h4>
      {connected && runs.length === 0 && <p>No runs yet.</p>}

      <ul>
        {runs.map((r) => (
          <li key={r.id}>
            {r.name} — {(r.distance / 1000).toFixed(2)} km —{" "}
            {Math.round(r.elapsed_time / 60)} min
          </li>
        ))}
      </ul>
    </div>
  );
};
