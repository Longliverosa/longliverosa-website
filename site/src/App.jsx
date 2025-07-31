import './App.css'
import { useRef } from 'react'

// --- Art Gallery Preload Logic ---
// Ensure preloading does not affect First Contentful Paint (FCP)
// Only trigger preloading on user intent (hover/focus), and defer all work
let artGalleryPreloadStarted = false;
function preloadArtGalleryImages() {
  if (artGalleryPreloadStarted) return;
  artGalleryPreloadStarted = true;

  // Defer all work to the background, after user interaction
  // Use requestIdleCallback if available, else setTimeout with a longer delay
  const defer = (cb) => {
    if ('requestIdleCallback' in window) {
      requestIdleCallback(cb, { timeout: 3000 });
    } else {
      setTimeout(cb, 2000);
    }
  };
  
  //Func to pre request the images for the art gallary when users hover over the gallary nav item.
  //Doing this makes the site feel faster even if it isnt.
  defer(async function fetchAndPreload() {
    try {
      // Dynamically import Firestore only when needed
      const [{ getFirestore, collection, getDocs, query, orderBy }, { app: firebaseApp }] = await Promise.all([
        import('firebase/firestore'),
        import('../config/firebase')
      ]);
      const db = getFirestore(firebaseApp);
      const q = query(collection(db, 'artworks'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const arts = snapshot.docs.map(doc => doc.data());
      // Preload images
      for (const art of arts) {
        if (art.url) {
          const img = new window.Image();
          img.src = art.url;
        }
      }
    } catch (e) {
      // Silently ignore errors
    }
  });
}

//function For displaying the navbar
function Navbar() {
  // Use a ref to avoid re-attaching the handler
  const artGalleryLinkRef = useRef(null);

  // Attach the hover handler only once
  function handleArtGalleryHover() {
    // Only trigger preloading on user intent, after FCP
    preloadArtGalleryImages();
  }

  return (
    <nav className="devblog-navbar">
      <div className="devblog-navbar-inner">
        <a href="/" className="devblog-navbar-title">Long live rosa</a>
        <div className="devblog-navbar-links">
          <a
            href="/art-gallery"
            className="devblog-navbar-link"
            ref={artGalleryLinkRef}
            onMouseEnter={handleArtGalleryHover}
            onFocus={handleArtGalleryHover}
          >
            Art Gallary
          </a>
          <a href="/Devblog" className="devblog-navbar-link">Devblog</a>
          <a href="/about" className="devblog-navbar-link">About</a>
          <a href='/rosa' className='devblog-navbar-link'>Rosa</a>
          <a href="https://www.youtube.com/@DougDougHaters" className="devblog-navbar-link">
            <img src="/youtube.png" alt="YouTube" className="devblog-navbar-logo" />
          </a>
          <a href="https://discord.com/invite/aX6JBrVC" className="devblog-navbar-link">
            <img src="/Discord.png" alt="Discord" className="devblog-navbar-logo" />
          </a>
          <a href="https://www.montereybayaquarium.org" className="devblog-navbar-link">
            <img
              src="/MBALogo.png"
              alt="Monterey Bay Aquarium"
              className="devblog-navbar-mba-logo"
            />
          </a>
        </div>
      </div>
    </nav>
  );
}

//main content for the index page
function App() {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h1>Long live rosa game</h1>
        <a
          href="https://github.com/Longliverosa/longliverosa-game"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginTop: '1.5rem',
            padding: '0.6rem 1.2rem',
            background: '#24292f',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 500,
            fontSize: '1rem',
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
            transition: 'background 0.2s'
          }}
        >
          <svg
            height="22"
            width="22"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ marginRight: '0.5em', verticalAlign: 'middle' }}
            aria-hidden="true"
          >
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
              0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52
              -.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2
              -3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64
              -.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08
              2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01
              1.93-.01 2.19 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
          </svg>
          View on GitHub
        </a>
      </div>
    </>
  )
}

export default App;
export { Navbar };
