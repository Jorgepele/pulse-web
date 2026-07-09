import { test, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { api } from "./api";
import PostList from "./PostList";

// Stub the API so the board renders without a backend. Empty `results` also
// makes NewPostForm render nothing (it needs at least one board).
vi.mock("./api", () => ({
  api: {
    get: vi.fn(() => Promise.resolve({ results: [] })),
    post: vi.fn(),
  },
}));

beforeEach(() => {
  api.get.mockClear();
});

test("renders the status filter pills", async () => {
  render(<PostList />);
  expect(await screen.findByText("All")).toBeInTheDocument();
  expect(screen.getByText("Planned")).toBeInTheDocument();
  expect(screen.getByText("In progress")).toBeInTheDocument();
});

test("clicking a filter refetches posts with the status query", async () => {
  render(<PostList />);
  await waitFor(() => expect(api.get).toHaveBeenCalledWith("/api/posts/"));

  fireEvent.click(screen.getByText("Planned"));
  await waitFor(() =>
    expect(api.get).toHaveBeenCalledWith("/api/posts/?status=planned"),
  );
});
