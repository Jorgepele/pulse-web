# Pulse Web — a React learning frontend

> A small React app that talks to [`pulse-api`](https://github.com/Jorgepele/pulse-api):
> register, log in, and (soon) browse and vote on feature requests.
> Built to learn JavaScript and React in the open — work in progress.

> Pequeña app en React que consume [`pulse-api`](https://github.com/Jorgepele/pulse-api):
> registro, login y (pronto) ver y votar peticiones. Hecha para aprender JavaScript y
> React sobre la marcha — en desarrollo.

**Stack:** JavaScript · React 19 · Vite

---

## What it does so far · Qué hace por ahora

- A single screen with a login / sign-up form.
- Talks to the API's token auth: on success it stores the token and shows the current user.
- Logout clears the token.

## What I'm learning · Qué estoy aprendiendo

- React basics: components, `useState`, `useEffect`, controlled form inputs.
- Calling a REST API from the browser with `fetch` and handling JSON errors.
- How token authentication works from the client side (`Authorization: Token <key>`).

## Run it locally · Cómo ejecutarlo

The API must be running first (see the `pulse-api` repo, default `http://127.0.0.1:8000`).

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Next steps · Siguientes pasos

- List feature requests from the API and vote on them.
- Split the UI into components (form, post list) as it grows.

---

MIT licensed. Built by [Jorge](https://github.com/Jorgepele) while learning React.
