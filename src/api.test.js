import { test, expect, vi, beforeEach, afterEach } from "vitest";
import { api, setToken, getToken, setUnauthorizedHandler } from "./api";

function respondWith(status, body) {
  vi.stubGlobal(
    "fetch",
    vi.fn(() => Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) })),
  );
}

beforeEach(() => {
  localStorage.clear();
  setUnauthorizedHandler(() => {});
});

afterEach(() => {
  vi.unstubAllGlobals();
});

test("sends the token when we have one", async () => {
  setToken("abc123");
  respondWith(200, { ok: true });

  await api.get("/api/posts/");

  const [, options] = fetch.mock.calls[0];
  expect(options.headers.Authorization).toBe("Token abc123");
});

test("a rejected token logs the user out", async () => {
  setToken("expired");
  const onUnauthorized = vi.fn();
  setUnauthorizedHandler(onUnauthorized);
  respondWith(401, { detail: "Invalid token." });

  await expect(api.get("/api/auth/me/")).rejects.toThrow("Invalid token.");
  expect(getToken()).toBeNull();
  expect(onUnauthorized).toHaveBeenCalled();
});

test("a 401 without a token does not trigger a logout", async () => {
  const onUnauthorized = vi.fn();
  setUnauthorizedHandler(onUnauthorized);
  respondWith(401, { detail: "Authentication credentials were not provided." });

  await expect(api.post("/api/posts/", {})).rejects.toThrow();
  expect(onUnauthorized).not.toHaveBeenCalled();
});

test("reads a DRF field error instead of dumping the JSON", async () => {
  respondWith(400, { board: ["This board does not exist."] });

  await expect(api.post("/api/posts/", { board: 9 })).rejects.toThrow(
    "This board does not exist.",
  );
});
