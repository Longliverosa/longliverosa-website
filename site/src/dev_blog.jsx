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

// This function parses the slash commands in the blog post content and returns HTML
function renderDevBlogContent(content) {
  if (typeof content !== 'string') return '';

  let html = content;

  // Headings
  html = html.replace(/\/h1\{([^}]*)\}/g, '<h1>$1</h1>');
  html = html.replace(/\/h2\{([^}]*)\}/g, '<h2>$1</h2>');
  html = html.replace(/\/h3\{([^}]*)\}/g, '<h3>$1</h3>');

  // Bold, Italic, Underline
  html = html.replace(/\/b\{([^}]*)\}/g, '<strong>$1</strong>');
  html = html.replace(/\/i\{([^}]*)\}/g, '<em>$1</em>');
  html = html.replace(/\/u\{([^}]*)\}/g, '<u>$1</u>');

  // Strikethrough
  html = html.replace(/\/s\{([^}]*)\}/g, '<s>$1</s>');

  // Inline code
  html = html.replace(/\/code\{([^}]*)\}/g, '<code>$1</code>');

  // Blockquote
  html = html.replace(/\/quote\{([^}]*)\}/g, '<blockquote>$1</blockquote>');

  // Bulleted list: /ul{item1|item2|item3}
  html = html.replace(/\/ul\{([^}]*)\}/g, (_, items) => {
    const lis = items.split('|').map(i => `<li>${i.trim()}</li>`).join('');
    return `<ul>${lis}</ul>`;
  });

  // Numbered list: /ol{([^}]*)\}/g, (_, items) => {
  html = html.replace(/\/ol\{([^}]*)\}/g, (_, items) => {
    const lis = items.split('|').map(i => `<li>${i.trim()}</li>`).join('');
    return `<ol>${lis}</ol>`;
  });

  // Toggle (Notion-style): /toggle{Title|Content}
  html = html.replace(/\/toggle\{([^|}]*)\|([^}]*)\}/g, (_, title, body) => {
    return `<details><summary>${title.trim()}</summary><div>${body.trim()}</div></details>`;
  });

  // Divider
  html = html.replace(/\/divider/g, '<hr>');

  // Link: /a{Text|URL}
  html = html.replace(/\/a\{([^|}]*)\|([^}]*)\}/g, (_, text, url) => {
    return `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">${text.trim()}</a>`;
  });

  // Image: /img{URL|alt text}
  html = html.replace(/\/img\{([^|}]*)\|([^}]*)\}/g, (_, url, alt) => {
    return `<img src="${url.trim()}" alt="${alt.trim()}" style="max-width:100%;">`;
  });

  // Callout: /callout{emoji|text}
  html = html.replace(/\/callout\{([^|}]*)\|([^}]*)\}/g, (_, emoji, text) => {
    return `<div style="background:#f1f5f9;padding:1em;border-radius:8px;display:flex;align-items:center;gap:0.7em;"><span style="font-size:1.3em;">${emoji.trim()}</span><span>${text.trim()}</span></div>`;
  });

  // Code block: /pre{language|code}
  html = html.replace(/\/pre\{([^|}]*)\|([^}]*)\}/g, (_, lang, code) => {
    // Escape HTML in code block for safety
    const escape = str => str.replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
    return `<pre><code class="language-${lang.trim()}">${escape(code.trim())}</code></pre>`;
  });

  // Optionally, replace newlines with <br> (if you want to preserve line breaks outside blocks)
  // html = html.replace(/\n/g, '<br>');

  return html;
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
          <div
            className="devblog-post-content"
            // Render parsed HTML from slash commands
            dangerouslySetInnerHTML={{ __html: renderDevBlogContent(selectedPost.content) }}
          />
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
              {/* Show a preview: parse and truncate the content */}
              <span
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    const raw = post.content || '';
                    // Truncate to 300 chars, but try not to break commands
                    let preview = raw;
                    if (raw.length > 300) {
                      // Try to cut at a safe boundary
                      let cut = raw.slice(0, 300);
                      // If the last slash command is incomplete, cut before it
                      const lastSlash = cut.lastIndexOf('/');
                      const lastBrace = cut.lastIndexOf('}');
                      if (lastSlash > lastBrace) {
                        cut = cut.slice(0, lastSlash);
                      }
                      preview = cut + '...';
                    }
                    return renderDevBlogContent(preview);
                  })()
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default DevBlog;
