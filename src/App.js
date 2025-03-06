import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://jsonplaceholder.typicode.com/posts";

function App() {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: "", body: "" });
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    try {
      const response = await axios.get(API_URL);
      setPosts(response.data.slice(0, 8)); 
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  }

  async function createPost() {
    try {
      const response = await axios.post(API_URL, newPost);
      setPosts([response.data, ...posts]);
      setNewPost({ title: "", body: "" });
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  function startEditing(post) {
    setEditingPost(post);
    setNewPost({ title: post.title, body: post.body });
  }

  async function updatePost() {
    if (!editingPost) return;
    try {
      const response = await axios.put(`${API_URL}/${editingPost.id}`, newPost);
      setPosts(posts.map((post) =>
        post.id === editingPost.id ? { ...post, ...response.data } : post
      ));
      setEditingPost(null);
      setNewPost({ title: "", body: "" });
    } catch (error) {
      console.error("Error updating post:", error);
    }
  }

  async function deletePost(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((post) => post.id !== id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  }

  return (
    <div className="container">
      <h2>CRUD Operations</h2>

      <div className="form-container">
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
        />
        <textarea
          placeholder="Body"
          value={newPost.body}
          onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
        />
        <button onClick={editingPost ? updatePost : createPost}>
          {editingPost ? "Update" : "Add"}
        </button>
      </div>

      <div className="card-grid">
        {posts.map((post) => (
          <div key={post.id} className="card">
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <div className="button-group">
              <button onClick={() => startEditing(post)} className="edit">
                Edit
              </button>
              <button onClick={() => deletePost(post.id)} className="delete">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
