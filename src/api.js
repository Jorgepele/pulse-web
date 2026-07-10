// Tiny client for the Pulse API.
// One place that knows the base URL, stores the auth token, and attaches it
// to every request. The rest of the app just calls api.get / api.post.

// In production, set VITE_API_URL to the deployed API. Falls back to the local
// Django dev server so `npm run dev` works with no configuration.
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const TOKEN_KEY = "pulse_token";

// --- token storage (kept in the browser's localStorage) ---------------------
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Called when the API rejects our token, so the app can send the user back to
// the login screen instead of showing an error on every action. App sets this.
let onUnauthorized = () => {};
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler;
};

// DRF reports validation errors as {"field": ["message", ...]}, and everything
// else as {"detail": "message"}. Pull out something a human can read.
function errorMessage(data) {
  if (data.detail) return data.detail;
  const first = Object.values(data)[0];
  if (Array.isArray(first) && first.length) return first[0];
  return typeof first === "string" ? first : "Something went wrong.";
}

// Core request helper. Adds JSON headers and, if we have one, the auth token.
async function request(path, { method = "GET", body } = {}) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `Token ${token}`;

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    // An expired or revoked token: drop it and let the app log the user out,
    // rather than leaving them in a session that can no longer do anything.
    if (response.status === 401 && token) {
      clearToken();
      onUnauthorized();
    }
    throw new Error(errorMessage(data));
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
};
