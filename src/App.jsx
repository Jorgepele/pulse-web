import { useEffect, useState } from "react";
import { api, getToken, clearToken, setUnauthorizedHandler } from "./api";
import Landing from "./Landing";
import PostList from "./PostList";
import Billing from "./Billing";
import "./App.css";

export default function App() {
  // `user` is null when logged out. `ready` guards the first render until we've
  // checked whether an existing token is still valid.
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  // If the API ever rejects our token, fall back to the logged-out view.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
  }, []);

  // On first render: if we already have a token, ask the API who we are.
  useEffect(() => {
    if (getToken()) {
      api.get("/api/auth/me/")
        .then(setUser)
        .catch(clearToken)
        .finally(() => setReady(true));
    } else {
      setReady(true);
    }
  }, []);

  function handleLogout() {
    clearToken();
    setUser(null);
  }

  if (!ready) return null;

  // --- logged out: show the landing page (pitch + pricing + auth) -----------
  if (!user) {
    return <Landing onAuthed={setUser} />;
  }

  // --- logged in: show the feedback board ----------------------------------
  return (
    <main className="page">
      <header className="topbar">
        <h1>Pulse</h1>
        <div className="who">
          <span>{user.email}</span>
          <button className="link" onClick={handleLogout}>Log out</button>
        </div>
      </header>
      <Billing />
      <PostList />
    </main>
  );
}
