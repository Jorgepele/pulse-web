// Tiny client for the Pulse API.
// One place that knows the base URL, stores the auth token, and attaches it
// to every request. The rest of the app just calls api.get / api.post.

const BASE_URL = "http://127.0.0.1:8000";
const TOKEN_KEY = "pulse_token";

// --- token storage (kept in the browser's localStorage) ---------------------
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

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
    // DRF returns validation errors as JSON; surface the first useful message.
    throw new Error(data.detail || JSON.stringify(data));
  }
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: "POST", body }),
};
