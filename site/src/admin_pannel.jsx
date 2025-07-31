import React, { useState, useRef, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { app as firebaseApp } from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './admin-pannel.css';

const app = firebaseApp || initializeApp({});
const db = getFirestore(app);

// List of all slash commands for autocomplete
const SLASH_COMMANDS = [
  { cmd: '/h1', desc: 'Heading 1', example: '/h1{Heading}' },
  { cmd: '/h2', desc: 'Heading 2', example: '/h2{Heading}' },
  { cmd: '/h3', desc: 'Heading 3', example: '/h3{Heading}' },
  { cmd: '/b', desc: 'Bold', example: '/b{bold text}' },
  { cmd: '/i', desc: 'Italic', example: '/i{italic text}' },
  { cmd: '/u', desc: 'Underline', example: '/u{underlined text}' },
  { cmd: '/s', desc: 'Strikethrough', example: '/s{strikethrough}' },
  { cmd: '/code', desc: 'Inline code', example: '/code{inline code}' },
  { cmd: '/pre', desc: 'Code block', example: '/pre{js|console.log("hi");}' },
  { cmd: '/ul', desc: 'Bulleted list', example: '/ul{item1|item2|item3}' },
  { cmd: '/ol', desc: 'Numbered list', example: '/ol{item1|item2|item3}' },
  { cmd: '/toggle', desc: 'Toggle (Notion-style)', example: '/toggle{Title|Content}' },
  { cmd: '/divider', desc: 'Divider', example: '/divider' },
  { cmd: '/a', desc: 'Link', example: '/a{Text|URL}' },
  { cmd: '/img', desc: 'Image', example: '/img{URL|alt text}' },
  { cmd: '/callout', desc: 'Callout', example: '/callout{emoji|text}' },
  { cmd: '/quote', desc: 'Blockquote', example: '/quote{quote text}' },
];

const interceptAndSendDevBlog = async (data) => {
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
      return `<a href="${url.trim()}" target="_blank" rel="noopener noreferrer">${text.trim()}</a>`;
    });

    // Image: /img{URL|alt text}
    content = content.replace(/\/img\{([^|}]*)\|([^}]*)\}/g, (_, url, alt) => {
      return `<img src="${url.trim()}" alt="${alt.trim()}" style="max-width:100%;">`;
    });

    // Callout: /callout{emoji|text}
    content = content.replace(/\/callout\{([^|}]*)\|([^}]*)\}/g, (_, emoji, text) => {
      return `<div style="background:#f1f5f9;padding:1em;border-radius:8px;display:flex;align-items:center;gap:0.7em;"><span style="font-size:1.3em;">${emoji.trim()}</span><span>${text.trim()}</span></div>`;
    });

    // Code block: /pre{language|code}
    content = content.replace(/\/pre\{([^|}]*)\|([^}]*)\}/g, (_, lang, code) => {
      return `<pre><code class="language-${lang.trim()}">${code.trim()}</code></pre>`;
    });

    data.content = content;
  }
  await addDoc(collection(db, 'devblogPosts'), data);
};

// Custom textarea with slash command autocomplete
const SlashCommandTextarea = ({
  value,
  onChange,
  disabled,
  id,
  ...props
}) => {
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [autocompleteOptions, setAutocompleteOptions] = useState([]);
  const [autocompleteIndex, setAutocompleteIndex] = useState(0);
  const [slashStart, setSlashStart] = useState(null);
  const textareaRef = useRef(null);
  const autocompleteRef = useRef(null);

  // Find the current word after the last slash
  const getSlashWord = (text, selectionStart) => {
    // Find the last slash before the cursor
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
      setSlashStart(slashWord.start);
    } else {
      setShowAutocomplete(false);
      setAutocompleteOptions([]);
      setSlashStart(null);
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
      // Move cursor to after the inserted command
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

  // Position autocomplete below the textarea caret

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
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '100%',
            zIndex: 10,
            background: 'white',
            color: "black",
            border: '1px solid #ddd',
            borderRadius: 6,
            marginTop: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            maxHeight: 220,
            overflowY: 'auto',
            fontSize: 14
          }}
        >
          {autocompleteOptions.map((cmd, idx) => (
            <div
              key={cmd.cmd}
              className={`slash-autocomplete-option${idx === autocompleteIndex ? ' selected' : ''}`}
              style={{
                padding: '8px 12px',
                background: idx === autocompleteIndex ? '#f1f5f9' : 'transparent',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseDown={e => { e.preventDefault(); handleAutocompleteClick(idx); }}
            >
              <span style={{ fontWeight: 500 }}>{cmd.cmd}</span>
              <span style={{ color: '#666', fontSize: 12 }}>{cmd.desc}</span>
              <span style={{ color: '#aaa', fontSize: 11 }}>{cmd.example}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AdminPanel = () => {
  const [showInviteCode, setShowInviteCode] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDevPostForm, setShowDevPostForm] = useState(false);

  // Add Art form state
  const [showAddArtForm, setShowAddArtForm] = useState(false);
  const [artFile, setArtFile] = useState(null);
  const [artistName, setArtistName] = useState('');
  const [addArtLoading, setAddArtLoading] = useState(false);
  const [addArtError, setAddArtError] = useState('');
  const [addArtSuccess, setAddArtSuccess] = useState('');

  // Dev post form state  
  const [devPostTitle, setDevPostTitle] = useState('');
  const [devPostContent, setDevPostContent] = useState('');
  const [devPostLoading, setDevPostLoading] = useState(false);
  const [devPostError, setDevPostError] = useState('');
  const [devPostSuccess, setDevPostSuccess] = useState('');

  // Auth state
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        // Not logged in, redirect to login page
        navigate('/login', { replace: true });
      } else {
        setUser(firebaseUser);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [navigate]);

  const handleAddArt = () => {
    setShowAddArtForm(true);
    setArtFile(null);
    setArtistName('');
    setAddArtError('');
    setAddArtSuccess('');
  };

  const handleAddArtBack = () => {
    setShowAddArtForm(false);
    setArtFile(null);
    setArtistName('');
    setAddArtError('');
    setAddArtSuccess('');
  };

  const handleAddArtFileChange = (e) => {
    setArtFile(e.target.files[0]);
    setAddArtError('');
    setAddArtSuccess('');
  };

  const handleAddArtSubmit = async (e) => {
    e.preventDefault();
    setAddArtError('');
    setAddArtSuccess('');
    if (!artFile) {
      setAddArtError('Please select a file to upload.');
      return;
    }
    if (!artistName.trim()) {
      setAddArtError('Please enter the artist name.');
      return;
    }
    setAddArtLoading(true);
    try {
      const storage = getStorage(firebaseApp);
      const filePath = `artworks/${Date.now()}_${artFile.name}`;
      const storageRef = ref(storage, filePath);

      // Upload the file
      await uploadBytes(storageRef, artFile);

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);
      // Save metadata to Firestore (without file URL)
      await addDoc(collection(db, 'artworks'), {
        artist: artistName.trim(),
        url: downloadURL,
        fileName: artFile.name,
        createdAt: serverTimestamp(),
      });
      setAddArtSuccess('Art uploaded successfully!');
      setArtFile(null);
      setArtistName('');
    } catch (err) {
      setAddArtError('Failed to upload art.');
      console.error(err);
    } finally {
      setAddArtLoading(false);
    }
  };

  const handleMakeDevPost = () => {
    setShowDevPostForm(true);
    setDevPostTitle('');
    setDevPostContent('');
    setDevPostError('');
    setDevPostSuccess('');
  };

  const handleAddUser = async () => {
    setLoading(true);
    setError('');
    // Generate a random 8-character alphanumeric code
    const randomCode = Math.random().toString(36).slice(2, 10).toUpperCase();

    try {
      // Add the invite code to Firestore
      await addDoc(collection(db, 'inviteCodes'), {
        code: randomCode,
        createdAt: serverTimestamp(),
        used: false
      });
      setInviteCode(randomCode);
      setShowInviteCode(true);
    } catch (err) {
      setError('Failed to add invite code to Firestore.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setShowInviteCode(false);
    setInviteCode('');
    setError('');
  };

  const handleDevPostBack = () => {
    setShowDevPostForm(false);
    setDevPostTitle('');
    setDevPostContent('');
    setDevPostError('');
    setDevPostSuccess('');
  };

  const handleDevPostSubmit = async (e) => {
    e.preventDefault();
    setDevPostError('');
    setDevPostSuccess('');
    if (!devPostTitle.trim() || !devPostContent.trim()) {
      setDevPostError('Title and content are required.');
      return;
    }
    setDevPostLoading(true);
    try {
      // Use interception function
      await interceptAndSendDevBlog({
        title: devPostTitle.trim(),
        content: devPostContent.trim(),
        createdAt: serverTimestamp()
      });
      setDevPostSuccess('Dev blog post created!');
      setDevPostTitle('');
      setDevPostContent('');
    } catch (err) {
      setDevPostError('Failed to create dev blog post.');
      console.error(err);
    } finally {
      setDevPostLoading(false);
    }
  };

  // New: handler for rosa-approve navigation
  const handleRosaApprove = () => {
    navigate('/rosa-approve');
  };

  if (!authChecked) {
    // Optionally, show a loading spinner or nothing while checking auth
    return (
      <div className="admin-panel-container">
        <div>Loading...</div>
      </div>
    );
  }

  // If user is null, the redirect will have already happened, but we can still guard
  if (!user) {
    return null;
  }

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Admin Panel</h2>
      {error && (
        <div className="admin-panel-error">
          {error}
        </div>
      )}
      {showAddArtForm ? (
        <form
          onSubmit={handleAddArtSubmit}
          className="admin-panel-form"
        >
          <label htmlFor="art-file">Upload Art File</label>
          <input
            id="art-file"
            type="file"
            accept="image/*"
            onChange={handleAddArtFileChange}
            disabled={addArtLoading}
          />
          <label htmlFor="artist-name">Artist Name</label>
          <input
            id="artist-name"
            type="text"
            value={artistName}
            onChange={e => setArtistName(e.target.value)}
            disabled={addArtLoading}
          />
          {addArtError && (
            <div className="admin-panel-error-inline">
              {addArtError}
            </div>
          )}
          {addArtSuccess && (
            <div className="admin-panel-success">
              {addArtSuccess}
            </div>
          )}
          <div className="admin-panel-btn-row">
            <button
              type="button"
              onClick={handleAddArtBack}
              className="admin-panel-btn-back"
              disabled={addArtLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="admin-panel-btn"
              disabled={addArtLoading}
            >
              {addArtLoading ? 'Uploading...' : 'Submit'}
            </button>
          </div>
        </form>
      ) : showDevPostForm ? (
        <form
          onSubmit={handleDevPostSubmit}
          className="admin-panel-form devpost-form"
        >
          <label htmlFor="devpost-title">Title</label>
          <input
            id="devpost-title"
            type="text"
            value={devPostTitle}
            onChange={e => setDevPostTitle(e.target.value)}
            autoFocus
            disabled={devPostLoading}
          />
          <label htmlFor="devpost-content">Content</label>
          <SlashCommandTextarea
            id="devpost-content"
            value={devPostContent}
            onChange={e => setDevPostContent(e.target.value)}
            disabled={devPostLoading}
            style={{ minHeight: 120, width: '100%', resize: 'vertical' }}
          />
          {devPostError && (
            <div className="admin-panel-error-inline">
              {devPostError}
            </div>
          )}
          {devPostSuccess && (
            <div className="admin-panel-success">
              {devPostSuccess}
            </div>
          )}
          <div className="admin-panel-btn-row">
            <button
              type="button"
              onClick={handleDevPostBack}
              className="admin-panel-btn-back"
              disabled={devPostLoading}
            >
              Back
            </button>
            <button
              type="submit"
              className="admin-panel-btn"
              disabled={devPostLoading}
            >
              {devPostLoading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      ) : !showInviteCode ? (
        <div className="admin-panel-flex-col-center">
          <button
            onClick={handleAddArt}
            className="admin-panel-btn"
          >
            Add Art
          </button>
          <button
            onClick={handleMakeDevPost}
            className="admin-panel-btn"
          >
            Make Dev Post
          </button>
          <button
            onClick={handleAddUser}
            disabled={loading}
            className="admin-panel-btn"
          >
            {loading ? 'Generating...' : 'Add User'}
          </button>
          {/* New button for rosa-approve navigation */}
          <button
            onClick={handleRosaApprove}
            className="admin-panel-btn"
            type="button"
          >
            Rosa Approve
          </button>
        </div>
      ) : (
        <div className="admin-panel-flex-col-center">
          <div className="admin-panel-invite-code">
            {inviteCode}
          </div>
          <button
            onClick={handleBack}
            className="admin-panel-btn-back"
          >
            Back
          </button>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
