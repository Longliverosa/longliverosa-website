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
      <div style={{ textAlign: 'center', marginTop: 60 }}>
        <h2>Access Denied</h2>
        <p>You must be signed in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="approve-rosa-container" style={{ maxWidth: 600, margin: "60px auto", padding: 24 }}>
      <h2>Approve Rosa Messages</h2>
      <p>Welcome, {user.email || user.displayName || 'User'}!</p>
      {error && <div style={{ color: "#ff4f4f", marginBottom: 16 }}>{error}</div>}
      {loading ? (
        <div>Loading messages...</div>
      ) : (
        <>
          {messages.length === 0 ? (
            <div style={{ marginTop: 32, color: "#888" }}>No messages awaiting approval.</div>
          ) : (
            <ul className="approve-rosa-list" style={{ listStyle: "none", padding: 0 }}>
              {messages.map(msg => (
                <li key={msg.id} className="approve-rosa-message" style={{
                  border: "1px solid #cce0ff",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 20,
                  background: "#f7fbff"
                }}>
                  <div style={{ marginBottom: 8, fontSize: 16, whiteSpace: "pre-line" }}>
                    {msg.message}
                  </div>
                  <div style={{ fontSize: 14, color: "#555", marginBottom: 12 }}>
                    <span>
                      {msg.anonymous ? "Anonymous" : (msg.name || "Unknown")}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      onClick={() => handleApprove(msg.id)}
                      disabled={!!actionLoading[msg.id]}
                      style={{
                        background: "#4caf50",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "6px 16px",
                        cursor: actionLoading[msg.id] ? "not-allowed" : "pointer"
                      }}
                    >
                      {actionLoading[msg.id] ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => handleDeny(msg.id)}
                      disabled={!!actionLoading[msg.id]}
                      style={{
                        background: "#f44336",
                        color: "#fff",
                        border: "none",
                        borderRadius: 4,
                        padding: "6px 16px",
                        cursor: actionLoading[msg.id] ? "not-allowed" : "pointer"
                      }}
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
