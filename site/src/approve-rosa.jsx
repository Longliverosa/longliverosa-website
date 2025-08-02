import './approve-rosa.css'

import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, getDocs, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { app as firebaseApp } from '../config/firebase';

function ApproveRosa() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState(null);

  // Auth check
  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setAuthChecked(true);
    });
    return () => unsubscribe();
  }, []);

  // Fetch unapproved messages
  useEffect(() => {
    if (!authChecked || !user) return;
    setLoading(true);
    setError(null);
    const fetchMessages = async () => {
      try {
        const db = getFirestore(firebaseApp);
        const rosaCollection = collection(db, "rosaMessages");
        // Only show unapproved messages
        const q = query(rosaCollection, where("approved", "==", false));
        const snapshot = await getDocs(q);
        const msgs = [];
        snapshot.forEach(docSnap => {
          msgs.push({ id: docSnap.id, ...docSnap.data() });
        });
        setMessages(msgs);
      } catch (err) {
        setError("Failed to fetch messages.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [authChecked, user]);

  // Approve handler
  const handleApprove = async (msgId) => {
    setActionLoading(prev => ({ ...prev, [msgId]: true }));
    setError(null);
    try {
      const db = getFirestore(firebaseApp);
      const msgRef = doc(db, "rosaMessages", msgId);
      await updateDoc(msgRef, { approved: true });
      setMessages(msgs => msgs.filter(m => m.id !== msgId));
    } catch (err) {
      setError("Failed to approve message.");
    } finally {
      setActionLoading(prev => ({ ...prev, [msgId]: false }));
    }
  };

  // Deny handler (delete)
  const handleDeny = async (msgId) => {
    const confirm = window.confirm("Are you sure you want to deny (delete) this message? This cannot be undone.");
    if (!confirm) return;
    setActionLoading(prev => ({ ...prev, [msgId]: true }));
    setError(null);
    try {
      const db = getFirestore(firebaseApp);
      const msgRef = doc(db, "rosaMessages", msgId);
      await deleteDoc(msgRef);
      setMessages(msgs => msgs.filter(m => m.id !== msgId));
    } catch (err) {
      setError("Failed to delete message.");
    } finally {
      setActionLoading(prev => ({ ...prev, [msgId]: false }));
    }
  };

  if (!authChecked) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div className="approve-rosa-container">
        <h2>Access Denied</h2>
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="approve-rosa-container">
      <h2>Approve Rosa Messages</h2>
      <p>Welcome, {user.email || user.displayName || 'User'}!</p>
      {error && <div className="approve-rosa-error">{error}</div>}
      {loading ? (
        <div>Loading messages...</div>
      ) : (
        <>
          {messages.length === 0 ? (
            <div className="approve-rosa-empty">No messages awaiting approval.</div>
          ) : (
            <ul className="approve-rosa-list">
              {messages.map(msg => (
                <li key={msg.id} className="approve-rosa-message">
                  <div>
                    {msg.message}
                  </div>
                  <div>
                    <span>
                      {msg.anonymous ? "Anonymous" : (msg.name || "Unknown")}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => handleApprove(msg.id)}
                      disabled={!!actionLoading[msg.id]}
                    >
                      {actionLoading[msg.id] ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleDeny(msg.id)}
                      disabled={!!actionLoading[msg.id]}
                    >
                      {actionLoading[msg.id] ? "Processing..." : "Deny"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}

export default ApproveRosa;
