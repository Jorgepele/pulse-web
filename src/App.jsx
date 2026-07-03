import { useEffect, useState } from "react";
import { api, getToken, setToken, clearToken } from "./api";
import "./App.css";

export default function App() {
  // `user` is null when logged out. `mode` toggles the form between the two actions.
  const [user, setUser] = useState(null);
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // On first render: if we already have a token, ask the API who we are.
  useEffect(() => {
    if (getToken()) {
      api.get("/api/auth/me/").then(setUser).catch(clearToken);
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setError("");
    try {
      const path = mode === "login" ? "/api/auth/login/" : "/api/auth/register/";
      const data = await api.post(path, { email, password });
      setToken(data.token); // remember the token for future requests
      setUser(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    clearToken();
    setUser(null);
    setEmail("");
    setPassword("");
  }

  // --- logged in: greet the user -------------------------------------------
  if (user) {
    return (
      <main className="card">
        <h1>Pulse</h1>
        <p>Signed in as <strong>{user.email}</strong></p>
        <button onClick={handleLogout}>Log out</button>
      </main>
    );
  }

  // --- logged out: show the auth form --------------------------------------
  return (
    <main className="card">
      <h1>Pulse</h1>
      <p>{mode === "login" ? "Log in to your account" : "Create an account"}</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{mode === "login" ? "Log in" : "Sign up"}</button>
      </form>

      {error && <p className="error">{error}</p>}

      <button
        className="link"
        onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}
      >
        {mode === "login" ? "Need an account? Sign up" : "Have an account? Log in"}
      </button>
    </main>
  );
}
