import React, { useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { app as firebaseApp } from '../config/firebase';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import './admin-pannel.css';

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
      await addDoc(collection(db, 'devblogPosts'), {
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

  return (
    <div className="admin-panel-container">
      <h2 className="admin-panel-title">Admin Panel</h2>
      {error && (
        <div className="admin-panel-error">
          {error}
        </div>
      )}
      {showAddArtForm ? (
        <div className="admin-panel-form-wrapper">
          <form
            onSubmit={handleAddArtSubmit}
            className="admin-panel-form"
          >
            <div className="admin-panel-form-group">
              <label htmlFor="art-file" className="admin-panel-label">Upload Art File</label>
              <input
                id="art-file"
                type="file"
                accept="image/*"
                onChange={handleAddArtFileChange}
                className="admin-panel-input"
                disabled={addArtLoading}
              />
            </div>
            <div className="admin-panel-form-group">
              <label htmlFor="artist-name" className="admin-panel-label">Artist Name</label>
              <input
                id="artist-name"
                type="text"
                value={artistName}
                onChange={e => setArtistName(e.target.value)}
                className="admin-panel-input"
                disabled={addArtLoading}
              />
            </div>
            {addArtError && (
              <div className="admin-panel-error-message">
                {addArtError}
              </div>
            )}
            {addArtSuccess && (
              <div className="admin-panel-success-message">
                {addArtSuccess}
              </div>
            )}
            <div className="admin-panel-form-actions">
              <button
                type="button"
                onClick={handleAddArtBack}
                className="admin-panel-btn admin-panel-btn-secondary"
                disabled={addArtLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className={`admin-panel-btn admin-panel-btn-primary${addArtLoading ? ' admin-panel-btn-loading' : ''}`}
                disabled={addArtLoading}
              >
                {addArtLoading ? 'Uploading...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      ) : showDevPostForm ? (
        <div className="admin-panel-form-wrapper">
          <form
            onSubmit={handleDevPostSubmit}
            className="admin-panel-form"
          >
            <div className="admin-panel-form-group">
              <label htmlFor="devpost-title" className="admin-panel-label">Title</label>
              <input
                id="devpost-title"
                type="text"
                value={devPostTitle}
                onChange={e => setDevPostTitle(e.target.value)}
                className="admin-panel-input"
                autoFocus
                disabled={devPostLoading}
              />
            </div>
            <div className="admin-panel-form-group">
              <label htmlFor="devpost-content" className="admin-panel-label">Content</label>
              <textarea
                id="devpost-content"
                value={devPostContent}
                onChange={e => setDevPostContent(e.target.value)}
                rows={7}
                className="admin-panel-textarea"
                disabled={devPostLoading}
              />
            </div>
            {devPostError && (
              <div className="admin-panel-error-message">
                {devPostError}
              </div>
            )}
            {devPostSuccess && (
              <div className="admin-panel-success-message">
                {devPostSuccess}
              </div>
            )}
            <div className="admin-panel-form-actions">
              <button
                type="button"
                onClick={handleDevPostBack}
                className="admin-panel-btn admin-panel-btn-secondary"
                disabled={devPostLoading}
              >
                Back
              </button>
              <button
                type="submit"
                className={`admin-panel-btn admin-panel-btn-primary${devPostLoading ? ' admin-panel-btn-loading' : ''}`}
                disabled={devPostLoading}
              >
                {devPostLoading ? 'Posting...' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      ) : !showInviteCode ? (
        <>
          <button
            onClick={handleAddArt}
            className="admin-panel-btn admin-panel-btn-primary"
          >
            Add Art
          </button>
          <button
            onClick={handleMakeDevPost}
            className="admin-panel-btn admin-panel-btn-primary"
          >
            Make Dev Post
          </button>
          <button
            onClick={handleAddUser}
            disabled={loading}
            className={`admin-panel-btn admin-panel-btn-primary${loading ? ' admin-panel-btn-loading' : ''}`}
          >
            {loading ? 'Generating...' : 'Add User'}
          </button>
        </>
      ) : (
        <div className="admin-panel-invite-wrapper">
          <div className="admin-panel-invite-code">
            Invite Code: {inviteCode}
          </div>
          <button
            onClick={handleBack}
            className="admin-panel-btn admin-panel-btn-secondary"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
