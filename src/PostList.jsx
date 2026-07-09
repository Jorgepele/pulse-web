import { useEffect, useState } from "react";
import { api } from "./api";
import NewPostForm from "./NewPostForm";
import Comments from "./Comments";

// Status filters shown above the board. Empty value means "all".
const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "open", label: "Open" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
  { value: "declined", label: "Declined" },
];

// The feedback board: the list of feature requests, each with an upvote button.
export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [openId, setOpenId] = useState(null); // which post has its comments open
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState(""); // active status filter ("" = all)

  // Load the posts from the API, applying the status filter when one is set.
  // Kept as a named function so we can also call it again after adding a post.
  function loadPosts() {
    setLoading(true);
    const query = status ? `?status=${status}` : "";
    api.get(`/api/posts/${query}`)
      .then((data) => setPosts(data.results)) // paginated response → use `results`
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadPosts, [status]); // reload on mount and whenever the filter changes

  // Toggle our vote on a post. The API returns the fresh count and whether we
  // now have a vote, so we patch just that post in place — no full reload.
  async function toggleVote(id) {
    try {
      const { voted, vote_count } = await api.post(`/api/posts/${id}/vote/`);
      setPosts((current) =>
        current.map((p) =>
          p.id === id ? { ...p, has_voted: voted, vote_count } : p
        )
      );
    } catch (err) {
      setError(err.message);
    }
  }

  // Show/hide the comment thread for a post (only one open at a time).
  function toggleComments(id) {
    setOpenId((current) => (current === id ? null : id));
  }

  // After a comment is added, bump that post's counter without a full reload.
  function bumpCommentCount(id) {
    setPosts((current) =>
      current.map((p) =>
        p.id === id ? { ...p, comment_count: p.comment_count + 1 } : p
      )
    );
  }

  return (
    <section className="posts">
      <NewPostForm onCreated={loadPosts} />

      <div className="filters">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            className={status === f.value ? "filter active" : "filter"}
            onClick={() => setStatus(f.value)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {error && <p className="error">{error}</p>}

      {loading && <p className="muted">Loading…</p>}
      {!loading && posts.length === 0 && (
        <p className="muted">
          {status
            ? "No posts with this status."
            : "No posts yet — add the first feature request above."}
        </p>
      )}

      <ul>
        {posts.map((post) => (
          <li key={post.id} className="post">
            <button
              className={post.has_voted ? "vote voted" : "vote"}
              onClick={() => toggleVote(post.id)}
            >
              ▲<span>{post.vote_count}</span>
            </button>
            <div className="post-body">
              <h3>{post.title}</h3>
              {post.body && <p>{post.body}</p>}
              <div className="post-meta">
                <small>{post.author_email}</small>
                <button className="link" onClick={() => toggleComments(post.id)}>
                  💬 {post.comment_count}
                </button>
              </div>
              {openId === post.id && (
                <Comments postId={post.id} onAdded={() => bumpCommentCount(post.id)} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
