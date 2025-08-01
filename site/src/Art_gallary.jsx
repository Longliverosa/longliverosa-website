import React, { useEffect, useState } from 'react';
import './art_gallary.css';
import { Navbar } from './App.jsx';

// --- FIRESTORE DB LAZY LOADING ---
let db = null;
let firestoreReady = false;
let firestoreInitPromise = null;

function getDbInstance() {
  if (firestoreReady && db) return Promise.resolve(db);
  if (firestoreInitPromise) return firestoreInitPromise;
  firestoreInitPromise = Promise.all([
    import('firebase/firestore'),
    import('../config/firebase')
  ]).then(([firestore, firebaseConfig]) => {
    db = firestore.getFirestore(firebaseConfig.app);
    firestoreReady = true;
    return db;
  });
  return firestoreInitPromise;
}

async function fetchArtworksFromFirestore() {
  const db = await getDbInstance();
  const { collection, getDocs, query, orderBy } = await import('firebase/firestore');
  const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// --- ART GALLERY COMPONENT ---
function ArtGallery() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enlargedArt, setEnlargedArt] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchArtworks() {
      setLoading(true);
      try {
        const arts = await fetchArtworksFromFirestore();
        if (isMounted) setArtworks(arts);
      } catch (err) {
        if (isMounted) setArtworks([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchArtworks();
    return () => { isMounted = false; };
  }, []);

  // Allow closing modal with Escape key
  useEffect(() => {
    if (!enlargedArt) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') setEnlargedArt(null);
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedArt]);

  return (
    <>
      <Navbar />
      <div className="art-gallery-container">
        <div className="art-gallery-title">Art Gallery</div>
        {loading && <div className="art-gallery-loading">Loading...</div>}
        {!loading && artworks.length === 0 && (
          <div className="art-gallery-empty">No art has been submitted yet.</div>
        )}
        {artworks.map(art => (
          <div key={art.id} className="art-polaroid">
            <img
              src={art.url}
              alt={art.fileName || 'Artwork'}
              loading="lazy"
              style={{ cursor: 'pointer' }}
              onClick={() => setEnlargedArt(art)}
              onError={async (e) => {
                // If image fails to load, try to refetch the URL from Firestore
                try {
                  const arts = await fetchArtworksFromFirestore();
                  const found = arts.find(a => a.id === art.id);
                  if (found && found.url && found.url !== art.url) {
                    e.target.src = found.url;
                  }
                } catch {
                  // ignore
                }
              }}
            />
            <div className="art-artist">{art.artist || 'Unknown Artist'}</div>
          </div>
        ))}
      </div>
      {enlargedArt && (
        <div className="art-gallery-modal" onClick={() => setEnlargedArt(null)}>
          <button
            className="art-gallery-modal-close-btn"
            aria-label="Close"
            onClick={e => {
              e.stopPropagation();
              setEnlargedArt(null);
            }}
          >
            &times;
          </button>
          <img
            src={enlargedArt.url}
            alt={enlargedArt.fileName || 'Artwork'}
            className="art-gallery-modal-img"
            onClick={e => e.stopPropagation()}
            onError={async (e) => {
              // If enlarged image fails to load, try to refetch the URL from Firestore
              try {
                const arts = await fetchArtworksFromFirestore();
                const found = arts.find(a => a.id === enlargedArt.id);
                if (found && found.url && found.url !== enlargedArt.url) {
                  e.target.src = found.url;
                }
              } catch {
                // ignore
              }
            }}
          />
        </div>
      )}
    </>
  );
}

export default ArtGallery;
