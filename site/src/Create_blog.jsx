import React, { useState, useRef, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { app as firebaseApp } from '../config/firebase';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './admin-pannel.css';
import './Create_blog.css';

// --- SLASH COMMANDS & INTERCEPTOR ---

const SLASH_COMMANDS = [
  { cmd: '/h1', desc: 'Heading 1', example: '/h1{Heading}' },
  { cmd: '/h2', desc: 'Heading 2', example: '/h2{Heading}' },
  { cmd: '/h3', desc: 'Heading 3', example: '/h3{Heading}' },
  { cmd: '/b', desc: 'Bold', example: '/b{bold text}' },
  { cmd: '/i', desc: 'Italic', example: '/i{italic text}' },
  { cmd: '/u', desc: 'Underline', example: '/u{underlined text}' },
  { cmd: '/s', desc: 'Strikethrough', example: '/s{strikethrough}' },
  { cmd: '/code', desc: 'html code', example: '/code{inline code}' },
  { cmd: '/pre', desc: 'Code block or GitHub Page iframe', example: '/pre{js|console.log("hi");} or /pre{iframe|https://your-github-username.github.io/your-repo/}' },
  { cmd: '/ul', desc: 'Bulleted list', example: '/ul{item1|item2|item3}' },
  { cmd: '/ol', desc: 'Numbered list', example: '/ol{item1|item2|item3}' },
  { cmd: '/toggle', desc: 'Toggle (Notion-style)', example: '/toggle{Title|Content}' },
  { cmd: '/divider', desc: 'Divider', example: '/divider' },
  { cmd: '/a', desc: 'Link', example: '/a{Text|URL}' },
  { cmd: '/img', desc: 'Image', example: '/img{URL|alt text}' },
  { cmd: '/callout', desc: 'Callout', example: '/callout{emoji|text}' },
  { cmd: '/quote', desc: 'Blockquote', example: '/quote{quote text}' },
];

const app = firebaseApp || initializeApp({});
const db = getFirestore(app);

/**
 * Only authenticated users can create devblogPosts (see Firestore rules).
 * This function expects the user to be authenticated before calling.
 * Ensures no non-plain-JSON objects (like AuthImpl) are included in Firestore data.
 */
export const interceptAndSendDevBlog = async (data) => {
  if (typeof data.content === 'string') {
    let content = data.content;

    // Headings
    content = content.replace(/\/h1\{([^}]*)\}/g, '<h1>$1</h1>');
    content = content.replace(/\/h2\{([^}]*)\}/g, '<h2>$1</h2>');
    content = content.replace(/\/h3\{([^}]*)\}/g, '<h3>$1</h3>');

    // Bold, Italic, Underline
    content = content.replace(/\/b\{([^}]*)\}/g, '<strong>$1</strong>');
    content = content.replace(/\/i\{([^}]*)\}/g, '<em>$1</em>');
    content = content.replace(/\/u\{([^}]*)\}/g, '<u>$1</u>');

    // Strikethrough
    content = content.replace(/\/s\{([^}]*)\}/g, '<s>$1</s>');

    // Inline code
    content = content.replace(/\/code\{([^}]*)\}/g, '<code>$1</code>');

    // Blockquote
    content = content.replace(/\/quote\{([^}]*)\}/g, '<blockquote>$1</blockquote>');

    // Bulleted list: /ul{item1|item2|item3}
    content = content.replace(/\/ul\{([^}]*)\}/g, (_, items) => {
      const lis = items.split('|').map(i => `<li>${i.trim()}</li>`).join('');
      return `<ul>${lis}</ul>`;
    });

    // Numbered list: /ol{item1|item2|item3}
    content = content.replace(/\/ol\{([^}]*)\}/g, (_, items) => {
      const lis = items.split('|').map(i => `<li>${i.trim()}</li>`).join('');
      return `<ol>${lis}</ol>`;
    });

    // Toggle (Notion-style): /toggle{Title|Content}
    content = content.replace(/\/toggle\{([^|}]*)\|([^}]*)\}/g, (_, title, body) => {
      return `<details><summary>${title.trim()}</summary><div>${body.trim()}</div></details>`;
    });

    // Divider
    content = content.replace(/\/divider/g, '<hr>');

    // Link: /a{Text|URL}
    content = content.replace(/\/a\{([^|}]*)\|([^}]*)\}/g, (_, text, url) => {
      return `<a href="${String(url).trim()}" target="_blank" rel="noopener noreferrer">${text.trim()}</a>`;
    });

    // Image: /img{URL|alt text}
    content = content.replace(/\/img\{([^|}]*)\|([^}]*)\}/g, (_, url, alt) => {
      return `<img src="${String(url).trim()}" alt="${alt.trim()}" style="max-width:100%;">`;
    });

    // Callout: /callout{emoji|text}
    content = content.replace(/\/callout\{([^|}]*)\|([^}]*)\}/g, (_, emoji, text) => {
      return `<div style="background:#f1f5f9;padding:1em;border-radius:8px;display:flex;align-items:center;gap:0.7em;"><span style="font-size:1.3em;">${emoji.trim()}</span><span>${text.trim()}</span></div>`;
    });

    // Code block or GitHub Page iframe: /pre{language|code} or /pre{iframe|url}
    content = content.replace(/\/pre\{([^|}]*)\|([^}]*)\}/g, (_, lang, codeOrUrl) => {
      if (lang.trim().toLowerCase() === 'iframe') {
        let url = String(codeOrUrl).trim();

        // Case 1: GitHub blob URL (convert to raw)
        const githubBlobMatch = url.match(/^https:\/\/github\.com\/([^\/]+)\/([^\/]+)\/blob\/(.+)$/);
        if (githubBlobMatch) {
          const [, user, repo, path] = githubBlobMatch;
          const rawUrl = `https://raw.githubusercontent.com/${user}/${repo}/${path}`;
          url = rawUrl;
        }

        // Case 2: GitHub Pages (static iframe)
        if (/^https:\/\/[a-zA-Z0-9\-]+\.github\.io\/[^\s]*$/.test(url)) {
          return `<div style="margin:1em 0;"><iframe src="${url}" style="width:100%;min-height:400px;border:1px solid #eee;border-radius:6px;" loading="lazy" sandbox="allow-scripts allow-same-origin allow-popups"></iframe></div>`;
        }

        // Case 3: Raw GitHub content (from blob conversion above or direct)
        if (/^https:\/\/raw\.githubusercontent\.com\/[^\s]+$/.test(url)) {
          return `<div style="margin:1em 0;">
            <iframe srcdoc="<pre><code id='code-block'>Loading...</code><script>
              fetch('${url}')
                .then(r => r.text())
                .then(t => {
                  const el = document.getElementById('code-block');
                  el.textContent = t;
                });
            </script>" 
            style="width:100%;min-height:400px;border:1px solid #eee;border-radius:6px;" 
            sandbox="allow-scripts" loading="lazy"></iframe>
          </div>`;
        }

        // Invalid iframe URL
        return `<div style="color:red;font-size:14px;">Invalid iframe URL: ${url}</div>`;
      } else {
        return `<pre><code class="language-${lang.trim()}">${codeOrUrl.trim()}</code></pre>`;
      }
    });

    // Update the data object with the processed content
    data = { ...data, content };
  }

  // Remove any accidental non-plain-JSON fields (like auth, user, etc)
  // Only allow plain values (string, number, boolean, null, array, plain object)
  // Defensive: create a new object with only allowed fields
  const allowed = {};
  for (const key in data) {
    const val = data[key];
    // Only allow primitives, null, arrays, or plain objects (not functions, not class instances)
    // EXPLICITLY SKIP 'auth' and 'user' fields to avoid FirebaseError
    if (
      key === 'auth' ||
      key === 'user'
    ) {
      continue;
    }
    if (
      val === null ||
      typeof val === 'string' ||
      typeof val === 'number' ||
      typeof val === 'boolean' ||
      (typeof val === 'object' && !Array.isArray(val) && Object.prototype.toString.call(val) === '[object Object]') ||
      Array.isArray(val)
    ) {
      allowed[key] = val;
    }
    // else: skip (do not include e.g. auth, user, etc)
  }
  await addDoc(collection(db, 'devblogPosts'), allowed);
};

// --- POPUPS FOR /img COMMAND ---

const ImgCommandPopup = ({
  onClose,
  onInsertUrl,
  onInsertUpload
}) => {
  return (
    <div
      className="img-command-popup-overlay"
      onClick={onClose}
    >
      <div
        className="img-command-popup"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Insert Image</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            className="admin-panel-btn"
            style={{ width: '100%' }}
            onClick={onInsertUrl}
            type="button"
          >
            Insert from URL
          </button>
          <button
            className="admin-panel-btn"
            style={{ width: '100%' }}
            onClick={onInsertUpload}
            type="button"
          >
            Upload Image
          </button>
        </div>
        <button
          className="admin-panel-btn-back"
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            fontSize: 18,
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer'
          }}
          onClick={onClose}
          aria-label="Close"
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
};

const ImgUrlInputPopup = ({
  onClose,
  onInsert
}) => {
  const [url, setUrl] = useState('');
  const [alt, setAlt] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) inputRef.current.focus();
    }, 0);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Please enter an image URL.');
      return;
    }
    onInsert(String(url).trim(), alt.trim());
  };

  return (
    <div
      className="img-command-popup-overlay"
      onClick={onClose}
    >
      <div
        className="img-command-popup"
        onClick={e => e.stopPropagation()}
        role="form"
        tabIndex={-1}
      >
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Insert Image from URL</div>
        <input
          ref={inputRef}
          type="text"
          placeholder="Image URL"
          value={url}
          onChange={e => setUrl(e.target.value)}
        />
        <input
          type="text"
          placeholder="Alt text (optional)"
          value={alt}
          onChange={e => setAlt(e.target.value)}
        />
        {error && <div style={{ color: 'red', fontSize: 13 }}>{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="admin-panel-btn"
            type="button"
            style={{ flex: 1 }}
            onClick={handleSubmit}
          >
            Insert
          </button>
          <button
            className="admin-panel-btn-back"
            type="button"
            style={{ flex: 1 }}
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- GALLERY-LIKE UPLOAD FOR /img COMMAND ---

const ImgUploadPopup = ({
  onClose,
  onInsert,
  firebaseApp
}) => {
  const [file, setFile] = useState(null);
  const [alt, setAlt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      if (fileInputRef.current) fileInputRef.current.focus();
    }, 0);
  }, [firebaseApp]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setProgress(0);
    if (!file) {
      setError('Please select an image file.');
      return;
    }
    setUploading(true);
    try {
      const auth = getAuth(firebaseApp);
      const user = auth.currentUser;
      if (!user) {
        setError('You must be logged in to upload images.');
        setUploading(false);
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed.');
        setUploading(false);
        return;
      }

      const storage = getStorage(firebaseApp);
      const filePath = `devblog_images/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, filePath);

      const metadata = {
        contentType: file.type,
        customMetadata: {
          uploadedBy: user.uid
        }
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(percent);
        },
        (err) => {
          if (
            err.code === 'storage/unauthorized' ||
            (err.message && err.message.includes('User does not have permission'))
          ) {
            setError('You do not have permission to upload images. Please make sure you are logged in.');
          } else if (
            err.code === 'storage/canceled'
          ) {
            setError('Upload canceled.');
          } else if (
            err.code === 'storage/unknown'
          ) {
            setError('Unknown error occurred during upload.');
          } else {
            setError('Failed to upload image.');
          }
          setUploading(false);
          setProgress(0);
          console.error(err);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            onInsert(String(downloadURL), alt.trim() || file.name);
          } catch (err) {
            setError('Failed to get image URL.');
            console.error(err);
          } finally {
            setUploading(false);
            setProgress(0);
          }
        }
      );
    } catch (err) {
      setError('Failed to upload image.');
      setUploading(false);
      setProgress(0);
      console.error(err);
    }
  };

  return (
    <div
      className="img-command-popup-overlay"
      onClick={onClose}
    >
      <div
        className="img-command-popup"
        onClick={e => e.stopPropagation()}
        role="form"
        tabIndex={-1}
      >
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>Upload Image</div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files[0])}
          disabled={uploading}
        />
        <input
          type="text"
          placeholder="Alt text (optional)"
          value={alt}
          onChange={e => setAlt(e.target.value)}
          disabled={uploading}
        />
        {progress > 0 && uploading && (
          <div className="progress-bar">
            <div
              className="progress-bar-inner"
              style={{ width: `${progress}%` }}
            />
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{progress}%</div>
          </div>
        )}
        {error && <div className="admin-panel-error-inline">{error}</div>}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className="admin-panel-btn"
            type="button"
            style={{ flex: 1 }}
            disabled={uploading}
            onClick={handleSubmit}
          >
            {uploading ? 'Uploading...' : 'Upload & Insert'}
          </button>
          <button
            className="admin-panel-btn-back"
            type="button"
            style={{ flex: 1 }}
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SLASH COMMAND TEXTAREA ---

export const SlashCommandTextarea = ({
  value,
  onChange,
  disabled,
  id,
  ...props
}) => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const textareaRef = useRef(null);
  const autocompleteRef = useRef(null);

  // For /img popup
  const [showImgPopup, setShowImgPopup] = useState(false);
  const [showImgUrlPopup, setShowImgUrlPopup] = useState(false);
  const [showImgUploadPopup, setShowImgUploadPopup] = useState(false);

  // Find the current word after the last slash
  const getSlashWord = (text, selectionStart) => {
    const before = text.slice(0, selectionStart);
    const match = before.match(/\/[a-zA-Z0-9]*$/);
    if (match) {
      return {
        word: match[0],
        start: before.length - match[0].length,
        end: before.length
      };
    }
    return null;
  };

  // Handle input change and show autocomplete if needed
  const handleInputChange = (e) => {
    const text = e.target.value;
    const cursor = e.target.selectionStart;
    const slashWord = getSlashWord(text, cursor);

    if (slashWord) {
      const filtered = SLASH_COMMANDS.filter(cmd =>
        cmd.cmd.startsWith(slashWord.word)
      );
      setAutocompleteOptions(filtered);
      setShowAutocomplete(filtered.length > 0);
      setAutocompleteIndex(0);
    } else {
      setShowAutocomplete(false);
      setAutocompleteOptions([]);
    }
    onChange(e);
  };

  // Handle keydown for navigation and selection
  const handleKeyDown = (e) => {
    if (showAutocomplete && autocompleteOptions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setAutocompleteIndex(i => (i + 1) % autocompleteOptions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setAutocompleteIndex(i => (i - 1 + autocompleteOptions.length) % autocompleteOptions.length);
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        selectAutocomplete(autocompleteIndex);
      } else if (e.key === 'Escape') {
        setShowAutocomplete(false);
      }
    }
  };

  // Insert the selected command at the cursor
  const selectAutocomplete = (index) => {
    if (!showAutocomplete || autocompleteOptions.length === 0) return;
    const cmd = autocompleteOptions[index];
    const textarea = textareaRef.current;
    if (!textarea) return;

    const text = textarea.value;
    const cursor = textarea.selectionStart;
    const slashWord = getSlashWord(text, cursor);

    if (slashWord) {
      // Special handling for /img
      if (cmd.cmd === '/img') {
        setShowAutocomplete(false);
        setShowImgPopup(true);
        return;
      }
      // Replace the slash word with the example
      const before = text.slice(0, slashWord.start);
      const after = text.slice(cursor);
      const insert = cmd.example;
      const newValue = before + insert + after;
      onChange({
        target: {
          value: newValue
        }
      });
      setTimeout(() => {
        const pos = before.length + insert.length;
        textarea.setSelectionRange(pos, pos);
        textarea.focus();
      }, 0);
      setShowAutocomplete(false);
    }
  };

  // Handle click outside to close autocomplete
  useEffect(() => {
    const handleClick = (e) => {
      if (
        autocompleteRef.current &&
        !autocompleteRef.current.contains(e.target) &&
        textareaRef.current &&
        !textareaRef.current.contains(e.target)
      ) {
        setShowAutocomplete(false);
      }
    };
    if (showAutocomplete) {
      document.addEventListener('mousedown', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, [showAutocomplete]);

  // Handle mouse click on autocomplete option
  const handleAutocompleteClick = (idx) => {
    selectAutocomplete(idx);
  };

  // Insert /img{URL|alt text} at the cursor
  const insertImgCommand = (url, alt) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const text = textarea.value;
    const cursor = textarea.selectionStart;
    const slashWord = getSlashWord(text, cursor);
    let before, after;
    if (slashWord && text.slice(slashWord.start, cursor) === '/img') {
      before = text.slice(0, slashWord.start);
      after = text.slice(cursor);
    } else {
      before = text.slice(0, cursor);
      after = text.slice(cursor);
    }
    const insert = `/img{${String(url)}|${alt}}`;
    const newValue = before + insert + after;
    onChange({
      target: {
        value: newValue
      }
    });
    setTimeout(() => {
      const pos = before.length + insert.length;
      textarea.setSelectionRange(pos, pos);
      textarea.focus();
    }, 0);
    setShowImgPopup(false);
    setShowImgUrlPopup(false);
    setShowImgUploadPopup(false);
  };

  // Handle /img popup actions
  const handleImgPopupClose = () => {
    setShowImgPopup(false);
    setShowImgUrlPopup(false);
    setShowImgUploadPopup(false);
  };
  const handleImgInsertUrl = () => {
    setShowImgPopup(false);
    setShowImgUrlPopup(true);
  };
  const handleImgInsertUpload = () => {
    setShowImgPopup(false);
    setShowImgUploadPopup(true);
  };

  return (
    <div style={{ position: 'relative' }}>
      <textarea
        ref={textareaRef}
        id={id}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        autoComplete="off"
        spellCheck={false}
        {...props}
      />
      {showAutocomplete && autocompleteOptions.length > 0 && (
        <div
          ref={autocompleteRef}
          className="slash-autocomplete-dropdown"
        >
          {autocompleteOptions.map((cmd, idx) => (
            <div
              key={cmd.cmd}
              className={`slash-autocomplete-option${idx === autocompleteIndex ? ' selected' : ''}`}
              onMouseDown={e => { e.preventDefault(); handleAutocompleteClick(idx); }}
            >
              <span style={{ fontWeight: 500 }}>{cmd.cmd}</span>
              <span style={{ color: '#666', fontSize: 12 }}>{cmd.desc}</span>
              <span style={{ color: '#aaa', fontSize: 11 }}>{cmd.example}</span>
            </div>
          ))}
        </div>
      )}
      {showImgPopup && (
        <ImgCommandPopup
          onClose={handleImgPopupClose}
          onInsertUrl={handleImgInsertUrl}
          onInsertUpload={handleImgInsertUpload}
        />
      )}
      {showImgUrlPopup && (
        <ImgUrlInputPopup
          onClose={handleImgPopupClose}
          onInsert={insertImgCommand}
        />
      )}
      {showImgUploadPopup && (
        <ImgUploadPopup
          onClose={handleImgPopupClose}
          onInsert={insertImgCommand}
          firebaseApp={firebaseApp}
        />
      )}
    </div>
  );
};

// --- CREATE BLOG PAGE ---

const CreateBlog = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login', { replace: true });
      } else {
        setUser(firebaseUser);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required.');
      return;
    }
    setLoading(true);
    try {
      await interceptAndSendDevBlog({
        title: title.trim(),
        content: content.trim(),
        createdAt: serverTimestamp(),
        authorId: user && user.uid ? user.uid : null
      });
      setSuccess('Blog post created!');
      setTitle('');
      setContent('');
    } catch (err) {
      setError('Failed to create blog post.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <div className="admin-panel-container">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Create Blog Post</h2>
      <form
        onSubmit={handleSubmit}
        className="admin-panel-form devpost-form"
      >
        <label htmlFor="blog-title">Title</label>
        <input
          id="blog-title"
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          autoFocus
          disabled={loading}
        />
        <label htmlFor="blog-content">Content</label>
        <SlashCommandTextarea
          id="blog-content"
          value={content}
          onChange={e => setContent(e.target.value)}
          disabled={loading}
          style={{ minHeight: 120, width: '100%', resize: 'vertical' }}
        />
        {error && (
          <div className="admin-panel-error-inline">
            {error}
          </div>
        )}
        {success && (
          <div className="admin-panel-success">
            {success}
          </div>
        )}
        <div className="admin-panel-btn-row">
          <button
            type="button"
            onClick={handleBack}
            className="admin-panel-btn-back"
            disabled={loading}
          >
            Back
          </button>
          <button
            type="submit"
            className="admin-panel-btn"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
