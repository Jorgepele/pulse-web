import { useState } from "react";
import { api, setToken } from "./api";

// The login / register form. It owns its own inputs and, on success, stores the
// token and hands the logged-in user back to the parent via `onAuthed`.
export default function AuthForm({ onAuthed }) {
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault(); // stop the browser from reloading the page
    setError("");
    try {
      const path = mode === "login" ? "/api/auth/login/" : "/api/auth/register/";
      const data = await api.post(path, { email, password });
      setToken(data.token); // remember the token for future requests
      onAuthed(data.user);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <>
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
    </>
  );
}
