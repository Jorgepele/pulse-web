import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { api } from "./api";
import Comments from "./Comments";

vi.mock("./api", () => ({
  api: { get: vi.fn(), post: vi.fn() },
}));

beforeEach(() => {
  vi.clearAllMocks();
  api.get.mockResolvedValue({ results: [] });
  api.post.mockResolvedValue({});
});

test("loads only this post's comments", async () => {
  render(<Comments postId={7} onAdded={() => {}} />);
  await waitFor(() =>
    expect(api.get).toHaveBeenCalledWith("/api/comments/?post=7"),
  );
});

test("shows an empty state when there are no comments", async () => {
  render(<Comments postId={1} onAdded={() => {}} />);
  expect(await screen.findByText("No comments yet.")).toBeInTheDocument();
});

test("renders the comments it receives", async () => {
  api.get.mockResolvedValue({
    results: [{ id: 1, body: "Yes please", author_email: "a@b.com" }],
  });
  render(<Comments postId={1} onAdded={() => {}} />);
  expect(await screen.findByText("Yes please")).toBeInTheDocument();
});

test("posting a comment sends it, clears the box and tells the parent", async () => {
  const onAdded = vi.fn();
  render(<Comments postId={3} onAdded={onAdded} />);

  const input = await screen.findByPlaceholderText("Add a comment…");
  fireEvent.change(input, { target: { value: "Great idea" } });
  fireEvent.click(screen.getByText("Send"));

  await waitFor(() =>
    expect(api.post).toHaveBeenCalledWith("/api/comments/", {
      post: 3,
      body: "Great idea",
    }),
  );
  await waitFor(() => expect(onAdded).toHaveBeenCalled());
  expect(input.value).toBe("");
});

test("shows the error when posting fails", async () => {
  api.post.mockRejectedValue(new Error("This post does not exist."));
  render(<Comments postId={3} onAdded={() => {}} />);

  fireEvent.change(await screen.findByPlaceholderText("Add a comment…"), {
    target: { value: "Nope" },
  });
  fireEvent.click(screen.getByText("Send"));

  expect(await screen.findByText("This post does not exist.")).toBeInTheDocument();
});
