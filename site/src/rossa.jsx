import './rosa.css';
import React, { useState, useEffect } from "react";
import { Navbar } from "./App.jsx";
import { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { app as firebaseApp } from '../config/firebase';

function Rosa() {
    const [message, setMessage] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [anonymous, setAnonymous] = useState(true);
    const [name, setName] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    // Approved messages state
    const [approvedMessages, setApprovedMessages] = useState([]);
    const [loadingApproved, setLoadingApproved] = useState(true);
    const [approvedError, setApprovedError] = useState(null);

    // Fetch approved messages on mount
    useEffect(() => {
        async function fetchApprovedMessages() {
            setLoadingApproved(true);
            setApprovedError(null);
            try {
                const db = getFirestore(firebaseApp);
                const rosaCollection = collection(db, "rosaMessages");
                let msgs = [];
                let snapshot;
                try {
                    const q = query(
                        rosaCollection,
                        where("approved", "==", true),
                        orderBy("createdAt", "desc")
                    );
                    snapshot = await getDocs(q);
                } catch (err) {
                    try {
                        const q = query(
                            rosaCollection,
                            where("approved", "==", true)
                        );
                        snapshot = await getDocs(q);
                    } catch (err2) {
                        throw err2;
                    }
                }
                snapshot.forEach(docSnap => {
                    msgs.push({ id: docSnap.id, ...docSnap.data() });
                });
                if (msgs.length > 1 && (!msgs[0].createdAt || typeof msgs[0].createdAt !== "object")) {
                    msgs.sort((a, b) => {
                        if (!a.createdAt || !b.createdAt) return 0;
                        try {
                            return b.createdAt.toMillis() - a.createdAt.toMillis();
                        } catch {
                            return 0;
                        }
                    });
                }
                setApprovedMessages(msgs);
            } catch (err) {
                setApprovedError("Failed to load approved messages. " + (err && err.message ? err.message : String(err)));
                console.error("Error loading approved messages:", err);
            } finally {
                setLoadingApproved(false);
            }
        }
        fetchApprovedMessages();
    }, []);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const db = getFirestore(firebaseApp);
        const rosaCollection = collection(db, "rosaMessages");

        const data = {
            message: message,
            name: anonymous ? "Anonymous" : name,
            anonymous: anonymous,
            approved: false,
            createdAt: serverTimestamp()
        };

        try {
            await addDoc(rosaCollection, data);
            setSubmitted(true);
        } catch (err) {
            setError("Sorry, there was an error submitting your message. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Navbar />
            <div className="rosa-container">
                <h1>Who is Rosa?</h1>
                <p>
                    Rosa was a beloved southern sea otter who lived at the Monterey Bay Aquarium. She was rescued as a pup in 1999 and became one of the aquarium’s most famous and adored residents, known for her playful spirit, intelligence, and gentle nature.
                </p>
                <p>
                    Rosa inspired thousands of fans around the world, especially through the <strong>DougDoug</strong> Twitch community, where viewers cheered her on during enrichment activities and celebrated her milestones. She became a symbol of resilience, joy, and the importance of marine conservation.
                </p>
                <p>
                    Rosa passed away in 2024 at the age of 25, making her one of the oldest known sea otters. Her legacy lives on through the community projects, art, and the love she inspired in people everywhere.
                </p>
                <h2>Why do we celebrate Rosa?</h2>
                <ul>
                    <li><strong>Ambassador for her species:</strong> Rosa helped educate the public about sea otters and ocean conservation.</li>
                    <li><strong>Community icon:</strong> She brought people together from all over the world to share joy and creativity.</li>
                    <li><strong>Inspiration:</strong> Her story motivates us to protect wildlife and cherish the natural world.</li>
                </ul>
                <p>
                    <em>Long live Rosa!</em>
                </p>
                <hr />
                <div className="rosa-form-section">
                    <h2>What does Rosa mean to you?</h2>
                    {submitted ? (
                        <div className="rosa-thankyou">
                            Thank you for sharing your thoughts about Rosa!
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                <span style={{ fontWeight: 500 }}>Submit Anonymously</span>
                                <input
                                    type="checkbox"
                                    checked={anonymous}
                                    onChange={e => setAnonymous(e.target.checked)}
                                    style={{ width: "1.2em", height: "1.2em" }}
                                    disabled={loading}
                                />
                            </label>
                            {!anonymous && (
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    placeholder="Your name / username"
                                    required
                                    disabled={loading}
                                />
                            )}
                            <textarea
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Share your thoughts, memories, or what Rosa means to you..."
                                rows={5}
                                required
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                            {error && (
                                <div style={{ color: "#ff4f4f", fontWeight: 500 }}>
                                    {error}
                                </div>
                            )}
                        </form>
                    )}
                </div>
                <hr style={{ margin: "2.5rem 0 1.5rem 0" }} />
                <div className="rosa-comments-section">
                    <h2 style={{ marginBottom: "1rem" }}>Community Messages</h2>
                    {loadingApproved ? (
                        <div>Loading messages...</div>
                    ) : approvedError ? (
                        <div style={{ color: "#ff4f4f", fontWeight: 500 }}>{approvedError}</div>
                    ) : approvedMessages.length === 0 ? (
                        <div style={{ color: "#888" }}>No messages have been approved yet.</div>
                    ) : (
                        <ul className="rosa-comments-list" style={{ listStyle: "none", padding: 0 }}>
                            {approvedMessages.map(msg => (
                                <li key={msg.id} className="rosa-comment" style={{
                                    border: "1px solid #cce0ff",
                                    borderRadius: 8,
                                    padding: 16,
                                    marginBottom: 18,
                                    background: "#f7fbff"
                                }}>
                                    <div style={{ marginBottom: 8, fontSize: 16, whiteSpace: "pre-line" ,color:'black'}}>
                                        {msg.message}
                                    </div>
                                    <div style={{ fontSize: 14, color: "#555" }}>
                                        <span>
                                            {msg.anonymous ? "Anonymous" : (msg.name || "Unknown")}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </>
    );
}

export default Rosa;