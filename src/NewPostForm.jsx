import { useEffect, useState } from "react";
import { api } from "./api";

// A small form to submit a new feature request. A post must belong to a board,
// so we first fetch the boards and offer them in a dropdown.
export default function NewPostForm({ onCreated }) {
  const [boards, setBoards] = useState([]);
  const [board, setBoard] = useState("");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/api/boards/").then((data) => {
      setBoards(data.results); // the API paginates: boards live under `results`
      if (data.results.length) setBoard(String(data.results[0].id));
    });
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await api.post("/api/posts/", { board: Number(board), title });
      setTitle("");
      onCreated(); // ask the parent to reload the list so the new post shows up
    } catch (err) {
      setError(err.message);
    }
  }

  // Nothing to post to until at least one board exists.
  if (!boards.length) return null;

  return (
    <form className="new-post" onSubmit={handleSubmit}>
      <select value={board} onChange={(e) => setBoard(e.target.value)}>
        {boards.map((b) => (
          <option key={b.id} value={b.id}>{b.name}</option>
        ))}
      </select>
      <input
        placeholder="Suggest a feature…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <button type="submit">Add</button>
      {error && <p className="error">{error}</p>}
    </form>
  );
}
