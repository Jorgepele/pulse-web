# Pulse Web — a React learning frontend

[![CI](https://github.com/Jorgepele/pulse-web/actions/workflows/ci.yml/badge.svg)](https://github.com/Jorgepele/pulse-web/actions/workflows/ci.yml)

> A small React app that talks to [`pulse-api`](https://github.com/Jorgepele/pulse-api):
> a landing page, log in, and a feedback board where you post, vote and comment.
> Built to learn JavaScript and React in the open — work in progress.

> Pequeña app en React que consume [`pulse-api`](https://github.com/Jorgepele/pulse-api):
> landing, login y un tablero de feedback para publicar, votar y comentar. Hecha para
> aprender JavaScript y React sobre la marcha — en desarrollo.

**Stack:** JavaScript · React 19 · Vite

---

## Live demo · Demo en vivo

Deployed on Render (free tier — the first load may take ~30 s while the service
wakes up):

**https://pulse-web-lvhx.onrender.com**

Log in with the demo account: `demo@pulse.dev` / `demo12345`.

Desplegado en Render (plan gratis — la primera carga puede tardar ~30 s mientras
el servicio arranca). Entra con la cuenta demo: `demo@pulse.dev` / `demo12345`.

---

## What it does so far · Qué hace por ahora

- A landing page with the pitch and the pricing tiers (read from the API).
- Login / sign-up against the API's token auth; the token is stored and reused.
- A feedback board: list feature requests, filter them by status, toggle an
  upvote, add a new post.
- A comment thread under each post.
- A (demo) plan picker to subscribe the organization to a plan.
- Logout clears the token.

## What I'm learning · Qué estoy aprendiendo

- React basics: components, `useState`, `useEffect`, controlled form inputs.
- Splitting a UI into components (`Landing`, `PostList`, `Comments`, `Billing`…).
- Calling a REST API from the browser with `fetch` and handling JSON errors.
- How token authentication works from the client side (`Authorization: Token <key>`).

## Run it locally · Cómo ejecutarlo

The API must be running first (see the `pulse-api` repo, default `http://127.0.0.1:8000`).
Seed it with `python manage.py seed_demo` for demo data, then log in with
`demo@pulse.dev` / `demo12345`.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

To point the app at a different API (e.g. a deployed one), set `VITE_API_URL`.

## Tests · Tests

```bash
npm run test        # Vitest + React Testing Library (component tests)
npm run lint        # oxlint
```

The component tests stub the API and check UI behaviour (the login/register
toggle, and that the board's status filter refetches with `?status=`). CI runs
lint, tests and build on every push (see the badge above).

## Next steps · Siguientes pasos

- Client-side form validation and clearer error messages.
- End-to-end tests against a running API.

---

MIT licensed. Built by [Jorge](https://github.com/Jorgepele) while learning React.
