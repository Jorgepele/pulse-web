import { useEffect, useState } from "react";
import { api } from "./api";

// Shows the organization's current plan and lets the user switch plans.
// Billing is simulated — subscribing records the choice but takes no payment.
export default function Billing() {
  const [plans, setPlans] = useState([]);
  const [sub, setSub] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/api/plans/").then((data) => setPlans(data.results)).catch(() => {});
    api.get("/api/billing/subscription/").then(setSub).catch(() => {});
  }, []);

  async function subscribe(slug) {
    setMessage("");
    try {
      const updated = await api.post("/api/billing/subscription/", { plan: slug });
      setSub(updated);
      setMessage(`Subscribed to ${updated.plan_name} — demo, no charge.`);
    } catch (err) {
      setMessage(err.message);
    }
  }

  return (
    <section className="billing">
      <span className="current">
        {sub ? `Plan: ${sub.plan_name} (${sub.status})` : "No plan yet"}
      </span>
      <span className="choose">
        {plans.map((plan) => (
          <button key={plan.id} className="link" onClick={() => subscribe(plan.slug)}>
            {plan.name}
          </button>
        ))}
      </span>
      {message && <span className="muted">{message}</span>}
    </section>
  );
}
