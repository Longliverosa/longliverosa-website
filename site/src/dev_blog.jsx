import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { app as firebaseApp } from '../config/firebase';
import { Navbar } from './App.jsx';
import './dev_blog.css';

const db = getFirestore(firebaseApp);

function formatDate(ts) {
  if (!ts) return '';
  // Firestore Timestamp object
  if (typeof ts.toDate === 'function') {
    return ts.toDate().toLocaleString();
  }
  // Fallback: try to parse as ISO string
  try {
    return new Date(ts).toLocaleString();
  } catch {
    return '';
  }
}

function DevBlog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);
      try {
        const q = query(collection(db, 'devblogPosts'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        const blogPosts = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(blogPosts);
      } catch (err) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (selectedPost) {
    return (
      <>
        <Navbar />
        <div className="devblog-container">
          <button className="devblog-back-btn" onClick={() => setSelectedPost(null)}>
            ← Back to all posts
          </button>
          <div className="devblog-post-title">{selectedPost.title}</div>
          <div className="devblog-post-date">
            {selectedPost.createdAt ? formatDate(selectedPost.createdAt) : ''}
          </div>
          <div className="devblog-post-content">{selectedPost.content}</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="devblog-container">
        <div className="devblog-title">Dev Blog</div>
        {loading && (
          <div className="devblog-loading">Loading...</div>
        )}
        {!loading && posts.length === 0 && (
          <div className="devblog-empty">
            No dev blog posts yet.
          </div>
        )}
        {posts.map(post => (
          <div
            key={post.id}
            className="devblog-post"
            onClick={() => setSelectedPost(post)}
            tabIndex={0}
            onKeyDown={e => {
              if (e.key === 'Enter' || e.key === ' ') setSelectedPost(post);
            }}
            role="button"
            aria-label={`View post: ${post.title}`}
          >
            <div className="devblog-post-title">{post.title}</div>
            <div className="devblog-post-date">
              {post.createdAt ? formatDate(post.createdAt) : ''}
            </div>
            <div className="devblog-post-content">
              {post.content.length > 300
                ? post.content.slice(0, 300) + '...'
                : post.content}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DevBlog;
