import { useEffect, useState } from "react";
import { api } from "./api";
import NewPostForm from "./NewPostForm";
import Comments from "./Comments";

// The feedback board: the list of feature requests, each with an upvote button.
export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [openId, setOpenId] = useState(null); // which post has its comments open
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load the posts from the API. Kept as a named function so we can also call it
  // again after adding a new post.
  function loadPosts() {
    setLoading(true);
    api.get("/api/posts/")
      .then((data) => setPosts(data.results)) // paginated response → use `results`
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadPosts, []); // run once, when the component first renders

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

      {error && <p className="error">{error}</p>}

      {loading && <p className="muted">Loading…</p>}
      {!loading && posts.length === 0 && (
        <p className="muted">No posts yet — add the first feature request above.</p>
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
