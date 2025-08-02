import React, { useState, useEffect } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { app as firebaseApp } from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import './admin-pannel.css';

// Import shared slash command textarea and interceptAndSendDevBlog from Create_blog.jsx
import CreateBlog, {
  interceptAndSendDevBlog as sharedInterceptAndSendDevBlog,
} from './Create_blog';
import { SlashCommandTextarea } from './Create_blog';

const app = firebaseApp || initializeApp({});
const db = getFirestore(app);

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
  const [auth, setAuth] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authInstance = getAuth(app);
    setAuth(authInstance);
    const unsubscribe = onAuthStateChanged(authInstance, (firebaseUser) => {
      if (!firebaseUser) {
        navigate('/login', { replace: true });
      } else {
        setUser(firebaseUser);
      }
      setAuthChecked(true);
    });
    return () => unsubscribe();
    // eslint-disable-next-line
  }, [navigate]);

  // --- ARTWORKS: Only authenticated users can upload images and add to Firestore ---
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
      // Only allow upload if user is authenticated (enforced by rules, but double-check here)
      if (!user) {
        setAddArtError('You must be logged in to upload art.');
        setAddArtLoading(false);
        return;
      }

      // Get a fresh auth token for the current user
      const token = await user.getIdToken();

      // Use the user's token to upload to storage
      const storage = getStorage(firebaseApp);
      const filePath = `artworks/${Date.now()}_${artFile.name}`;
      const storageRef = ref(storage, filePath);

      // Patch: Use uploadBytes with custom token if needed (Firebase JS SDK uses current user automatically)
      // But if user is not properly authenticated, this will fail with 403
      // So, if you get a 403, show a more helpful error
      try {
        await uploadBytes(storageRef, artFile);
      } catch (uploadErr) {
        if (
          uploadErr.code === 'storage/unauthorized' ||
          (uploadErr.message && uploadErr.message.includes('User does not have permission'))
        ) {
          setAddArtError(
            'You do not have permission to upload art. Please make sure you are logged in with an account that has upload access. If the problem persists, contact an admin to check your Firebase Storage security rules.'
          );
          setAddArtLoading(false);
          return;
        } else {
          // If the error message contains "permission" or "unauthorized", show the custom message
          if (
            uploadErr.message &&
            (uploadErr.message.toLowerCase().includes('permission') ||
             uploadErr.message.toLowerCase().includes('unauthorized'))
          ) {
            setAddArtError(
              'You do not have permission to upload art. Please make sure you are logged in with an account that has upload access. If the problem persists, contact an admin to check your Firebase Storage security rules.'
            );
            setAddArtLoading(false);
            return;
          }
          throw uploadErr;
        }
      }

      const downloadURL = await getDownloadURL(storageRef);

      // Only authenticated users can write to 'artworks' collection (see rules)
      await addDoc(collection(db, 'artworks'), {
        artist: artistName.trim(),
        url: downloadURL,
        fileName: artFile.name,
        createdAt: serverTimestamp(),
        uploaderUid: user.uid,
      });
      setAddArtSuccess('Art uploaded successfully!');
      setArtFile(null);
      setArtistName('');
    } catch (err) {
      // If the error message contains "permission" or "unauthorized", show the custom message
      if (
        err &&
        err.message &&
        (err.message.toLowerCase().includes('permission') ||
         err.message.toLowerCase().includes('unauthorized'))
      ) {
        setAddArtError(
          'You do not have permission to upload art. Please make sure you are logged in with an account that has upload access. If the problem persists, contact an admin to check your Firebase Storage security rules.'
        );
      } else {
        setAddArtError(
          err && err.message
            ? `Failed to upload art: ${err.message}`
            : 'Failed to upload art.'
        );
      }
      console.error(err);
    } finally {
      setAddArtLoading(false);
    }
  };

  // --- DEV BLOG POSTS: Only authenticated users can create posts (see rules) ---
  const handleMakeDevPost = () => {
    setShowDevPostForm(true);
    setDevPostTitle('');
    setDevPostContent('');
    setDevPostError('');
    setDevPostSuccess('');
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
      // Only authenticated users can create devblogPosts (see rules)
      if (!user) {
        setDevPostError('You must be logged in to post.');
        setDevPostLoading(false);
        return;
      }
      await sharedInterceptAndSendDevBlog({
        title: devPostTitle.trim(),
        content: devPostContent.trim(),
        createdAt: serverTimestamp(),
        auth: auth,
        user: user,
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

  // --- INVITE CODES: Only authenticated users can write to inviteCodes (see fallback rule) ---
  const handleAddUser = async () => {
    setLoading(true);
    setError('');
    const randomCode = Math.random().toString(36).slice(2, 10).toUpperCase();

    try {
      // Only authenticated users can write to inviteCodes (see fallback rule)
      if (!user) {
        setError('You must be logged in to add a user.');
        setLoading(false);
        return;
      }
      await addDoc(collection(db, 'inviteCodes'), {
        code: randomCode,
        createdAt: serverTimestamp(),
        used: false,
        createdBy: user.uid,
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

  const handleRosaApprove = () => {
    navigate('/rosa-approve');
  };

  if (!authChecked) {
    return (
      <div className="admin-panel-container">
        <div>Loading...</div>
      </div>
    );
  }

  if (!user) {
    // Auth state checked, but not logged in (should redirect already)
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
