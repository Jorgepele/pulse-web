import { useEffect, useState } from "react";
import { api } from "./api";

// The comment thread for a single post. Loads its own comments and lets the
// logged-in user add one. Rendered only when a post is expanded.
export default function Comments({ postId, onAdded }) {
  const [comments, setComments] = useState([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  // Ask the API for just this post's comments (the endpoint filters by ?post=).
  function loadComments() {
    api.get(`/api/comments/?post=${postId}`)
      .then((data) => setComments(data.results)) // paginated → use `results`
      .catch((err) => setError(err.message));
  }

  useEffect(loadComments, [postId]); // reload if the post changes

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    try {
      await api.post("/api/comments/", { post: postId, body });
      setBody("");
      loadComments();
      onAdded(); // let the parent bump the comment count on the post
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="comments">
      {comments.length === 0 && <p className="muted">No comments yet.</p>}
      <ul>
        {comments.map((c) => (
          <li key={c.id}>
            <span>{c.body}</span>
            <small>{c.author_email}</small>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          placeholder="Add a comment…"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button type="submit">Send</button>
      </form>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
