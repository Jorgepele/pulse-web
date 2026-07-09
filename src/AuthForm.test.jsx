import { test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import AuthForm from "./AuthForm";

// The form only needs the api module stubbed; we're testing UI behaviour.
vi.mock("./api", () => ({
  api: { post: vi.fn(() => Promise.resolve({ token: "t", user: {} })) },
  setToken: vi.fn(),
}));

test("shows the login form by default", () => {
  render(<AuthForm onAuthed={() => {}} />);
  expect(screen.getByText("Log in to your account")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Log in" })).toBeInTheDocument();
});

test("can switch to the register form", () => {
  render(<AuthForm onAuthed={() => {}} />);
  fireEvent.click(screen.getByText("Need an account? Sign up"));
  expect(screen.getByText("Create an account")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
});
