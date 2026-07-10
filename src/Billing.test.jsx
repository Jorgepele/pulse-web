import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { api } from "./api";
import Billing from "./Billing";

vi.mock("./api", () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));

const PLANS = { results: [{ id: 1, name: "Pro", slug: "pro" }] };

// The two requests Billing fires on mount, answered by URL.
function mockApi({ plans = PLANS, subscription = null, plansFail = false } = {}) {
  api.get.mockImplementation((path) => {
    if (path === "/api/plans/") {
      return plansFail
        ? Promise.reject(new Error("Service unavailable."))
        : Promise.resolve(plans);
    }
    return subscription ? Promise.resolve(subscription) : Promise.reject(new Error("none"));
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  mockApi();
});

test("shows no plan yet when the organization has no subscription", async () => {
  render(<Billing />);
  expect(await screen.findByText("No plan yet")).toBeInTheDocument();
});

test("shows the current plan and status", async () => {
  mockApi({ subscription: { plan_name: "Pro", status: "trialing" } });
  render(<Billing />);
  expect(await screen.findByText("Plan: Pro (trialing)")).toBeInTheDocument();
});

test("subscribing posts the plan slug and reports the demo charge", async () => {
  api.post.mockResolvedValue({ plan_name: "Pro", status: "trialing" });
  render(<Billing />);

  fireEvent.click(await screen.findByText("Pro"));

  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith("/api/billing/subscription/", {
      plan: "pro",
    }),
  );
  expect(
    await screen.findByText("Subscribed to Pro — demo, no charge."),
  ).toBeInTheDocument();
});

test("surfaces the error when the plans cannot be loaded", async () => {
  mockApi({ plansFail: true });
  render(<Billing />);
  expect(await screen.findByText("Service unavailable.")).toBeInTheDocument();
});

test("shows the error when subscribing fails", async () => {
  api.post.mockRejectedValue(new Error("You need an organization to subscribe."));
  render(<Billing />);

  fireEvent.click(await screen.findByText("Pro"));

  expect(
    await screen.findByText("You need an organization to subscribe."),
  ).toBeInTheDocument();
});
