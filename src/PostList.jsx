import { useEffect, useState } from "react";
import { api } from "./api";
import NewPostForm from "./NewPostForm";

// The feedback board: the list of feature requests, each with an upvote button.
export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  // Load the posts from the API. Kept as a named function so we can also call it
  // again after adding a new post.
  function loadPosts() {
    api.get("/api/posts/")
      .then((data) => setPosts(data.results)) // paginated response → use `results`
      .catch((err) => setError(err.message));
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

  return (
    <section className="posts">
      <NewPostForm onCreated={loadPosts} />

      {error && <p className="error">{error}</p>}

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
              <small>{post.author_email}</small>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
