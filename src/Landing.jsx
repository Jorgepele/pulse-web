import { useEffect, useState } from "react";
import { api } from "./api";
import AuthForm from "./AuthForm";

// The public front page: a short pitch, the pricing tiers (from /api/plans/) and
// the sign-up / log-in form. Shown to anyone who isn't logged in yet.
export default function Landing({ onAuthed }) {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    api.get("/api/plans/")
      .then((data) => setPlans(data.results)) // paginated → use `results`
      .catch(() => setPlans([])); // pricing is optional; don't block the page
  }, []);

  return (
    <div className="landing">
      <section className="hero">
        <h1>Pulse</h1>
        <p className="tagline">
          Collect product feedback, let your users vote, and ship what matters most.
        </p>
      </section>

      {plans.length > 0 && (
        <section className="pricing">
          {plans.map((plan) => (
            <div key={plan.id} className="plan">
              <h3>{plan.name}</h3>
              <p className="price">
                ${(plan.price_cents / 100).toFixed(0)}<span>/mo</span>
              </p>
              <p className="muted">
                {plan.max_boards} board{plan.max_boards === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </section>
      )}

      <section className="card">
        <AuthForm onAuthed={onAuthed} />
      </section>
    </div>
  );
}
