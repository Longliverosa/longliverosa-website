import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs, query, orderBy } from 'firebase/firestore';
import { app as firebaseApp } from '../config/firebase';
import { Navbar } from './App.jsx';
import './dev_blog.css';

const db = getFirestore(firebaseApp);

function formatDate(ts) {
  if (!ts) return '';
  if (typeof ts.toDate === 'function') {
    return ts.toDate().toLocaleString();
  }
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

  // Numbered list: /ol{item1|item2|item3}
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

  // Code block or GitHub Page iframe: /pre{language|code} or /pre{iframe|url}
  html = html.replace(/\/pre\{([^|}]*)\|([^}]*)\}/g, (_, lang, codeOrUrl) => {
    if (lang.trim().toLowerCase() === 'iframe') {
      let url = String(codeOrUrl).trim();
      if (/^https:\/\/[a-zA-Z0-9\-]+\.github\.io\/[^\s]*$/.test(url)) {
        return `<div style="margin:1em 0;"><iframe src="${url}" style="width:100%;min-height:400px;border:1px solid #eee;border-radius:6px;" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe></div>`;
      } else {
        return `<div style="color:red;font-size:14px;">Invalid GitHub Pages URL for iframe: ${url}</div>`;
      }
    } else {
      const escape = str => str.replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
      }[c]));
      return `<pre><code class="language-${lang.trim()}">${escape(codeOrUrl.trim())}</code></pre>`;
    }
  });

  return html;
}

// Helper to extract the first /pre code block's url (if present) and log it
function extractAndLogFirstPreUrl(content) {
  if (typeof content !== 'string') return;
  const preMatch = content.match(/\/pre\{([^|}]*)\|([^}]*)\}/);
  if (preMatch) {
    const urlOrCode = preMatch[2];
    console.log(urlOrCode);
  }
}

// Helper to determine if a post preview contains an image slash command
function previewHasImage(content) {
  if (typeof content !== 'string') return false;
  let preview = content;
  if (preview.length > 300) {
    let cut = preview.slice(0, 300);
    const lastSlash = cut.lastIndexOf('/');
    const lastBrace = cut.lastIndexOf('}');
    if (lastSlash > lastBrace) {
      cut = cut.slice(0, lastSlash);
    }
    preview = cut + '...';
  }
  return /\/img\{([^|}]*)\|([^}]*)\}/.test(preview);
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
    extractAndLogFirstPreUrl(selectedPost.content);

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
        {posts.map(post => {
          const raw = post.content || '';
          let preview = null;
          let isUrlPreview = false;

          // Check if raw is a string and contains the specific iframe srcdoc snippet
          // Check for iframe code block with fetch, and extract the URL from fetch('...')
          if (
            typeof raw === 'string' &&
            raw.includes("<iframe srcdoc=\"<pre><code id='code-block'>Loading...</code><script>")
          ) {
            // Try to extract the URL from fetch('...')
            const fetchUrlMatch = raw.match(/fetch\(['"`]([^'"`]+)['"`]\)/);
            if (fetchUrlMatch && fetchUrlMatch[1]) {
              const url = fetchUrlMatch[1];
              // display the url as preview
              preview = url;
              isUrlPreview = true;
            }
          }
          if (preview === null) {
            preview = raw;
          }
          if (!isUrlPreview && raw.length > 300) {
            let cut = raw.slice(0, 300);
            const lastSlash = cut.lastIndexOf('/');
            const lastBrace = cut.lastIndexOf('}');
            if (lastSlash > lastBrace) {
              cut = cut.slice(0, lastSlash);
            }
            preview = cut + '...';
          }
          // No code block extraction for preview meta
          const hasImage = previewHasImage(raw);

          return (
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
                {/* No codeInfo meta display */}
                {hasImage && (
                  <span
                    className="devblog-preview-image-indicator"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4em',
                      fontSize: '0.93em',
                      color: '#0ea5e9',
                      marginBottom: '0.3em',
                      fontWeight: 500,
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{marginRight: 3, verticalAlign: 'middle'}} xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="4" width="14" height="10" rx="2" fill="#0ea5e9" fillOpacity="0.13" stroke="#0ea5e9"/>
                      <circle cx="7" cy="8" r="1.2" fill="#0ea5e9"/>
                      <path d="M4.5 13L8.5 9L11.5 12L14.5 9L16 10.5" stroke="#0ea5e9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    image
                  </span>
                )}
                {isUrlPreview ? (
                  <span style={{
                    color: '#fff',
                    backgroundColor: '#22c55e',
                    border: '1.5px solid #16a34a',
                    fontWeight: 500,
                    wordBreak: 'break-all',
                    borderRadius: '0.3em',
                    padding: '0.13em 0.5em'
                  }}>
                    {preview}
                  </span>
                ) : (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: renderDevBlogContent(preview)
                    }}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default DevBlog;
