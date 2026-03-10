import React, { useEffect, useState } from "react";
import  "../styles/Strava.css";

export const Strava = () => {
  const [connected, setConnected] = useState(false);
  const [msg, setMsg] = useState("");
  const [runs, setRuns] = useState([]);

  const [name, setName] = useState("");
  const [distance, setDistance] = useState("");
  const [minutes, setMinutes] = useState("");
  const [start, setStart] = useState("");

  const token = localStorage.getItem("token");

  const backend = import.meta.env.VITE_BACKEND_URL;

  const checkStatus = async () => {
    setMsg("");

    const res = await fetch(backend + "/strava/status", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setConnected(Boolean(data.connected));
    } else {
      setMsg(data.msg || "Could not check Strava status.");
    }
  };

  const connectStrava = async () => {
    setMsg("");

    const res = await fetch(backend + "/strava/login-url", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.msg || "Could not get Strava login URL.");
      return;
    }

    if (!data.auth_url) {
      setMsg("Backend did not return auth_url.");
      return;
    }

    window.location.assign(data.auth_url);
  };

  const loadRuns = async () => {
    setMsg("");

    const res = await fetch(backend + "/strava/runs", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    const data = await res.json();

    if (res.ok) {
      setRuns(data);
    } else {
      setMsg(data.msg || "Could not load runs.");
    }
  };

  const createRun = async (e) => {
    e.preventDefault();
    setMsg("");

    const res = await fetch(backend + "/strava/create-run", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        distance: Number(distance), 
        elapsed_time: Number(minutes) * 60, 
        start_date_local: new Date(start).toISOString(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setMsg(data.msg || "Failed to create run.");
      return;
    }

    setMsg("Run created!");
    setName("");
    setDistance("");
    setMinutes("");
    setStart("");

    loadRuns();
  };

  useEffect(() => {
    if (!token) return;

    const connectedParam =
      new URLSearchParams(window.location.search).get("connected") === "true";

    if (connectedParam) {
      setMsg("Strava connected!");
      window.history.replaceState({}, "", window.location.pathname);
    }

    checkStatus();

  }, []);

  useEffect(() => {
    if (connected) {
      loadRuns();
    }
  }, [connected]);

  if (!token) {
    return (
      <p>
        You need to <a href="/login">log in</a> first.
      </p>
    );
  }

   return (
      <div className="strava-page">
        <div className="strava-card">
          <h3 className="strava-title">Strava Journal</h3>

          <div className="strava-buttons">
            <button className="activity-btn" onClick={connectStrava}>
              Connect Strava
            </button>

            <button
              className="activity-btn"
              onClick={loadRuns}
              disabled={!connected}
            >
              Refresh Runs
            </button>
          </div>

          {msg && <p className="strava-message">{msg}</p>}

          {!connected ? (
            <p className="strava-muted">Not connected yet.</p>
          ) : (
            <>
              <h4 className="section-title">Log a Run</h4>

              <form onSubmit={createRun} className="strava-form">
                <input
                  className="runname-input"
                  placeholder="Run name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <input
                  className="runname-input"
                  placeholder="Distance (meters)"
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  required
                />

                <input
                  className="runname-input"
                  placeholder="Duration (minutes)"
                  type="number"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  required
                />

                <input
                  className="runname-input"
                  type="datetime-local"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                />

                <button type="submit" className="activity-btn">
                  Save Run
                </button>
              </form>

              <h4 className="section-title">Recent Runs</h4>

              {runs.length === 0 ? (
                <p className="strava-muted">No runs yet.</p>
              ) : (
                <ul className="run-list">
                  {runs.map((r) => (
                    <li key={r.id} className="run-item">
                      <span className="run-name">{r.name}</span>
                      <span className="run-stats">
                        {(r.distance / 1000).toFixed(2)} km •{" "}
                        {Math.round(r.elapsed_time / 60)} min
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    );
};