import './App.css'
import { useRef, useEffect, useRef as useReactRef } from 'react'

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

// BubblesBackground component
function BubblesBackground() {
  const canvasRef = useReactRef(null);
  const animationRef = useReactRef();
  const bubblesRef = useReactRef([]);
  const spawnTimeoutRef = useReactRef();

  // Helper to get canvas size
  function resizeCanvasToWindow(canvas) {
    // Make canvas cover the viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Bubble properties
  function spawnBubble(canvas) {
    const minRadius = 5;
    const maxRadius = 10;
    const radius = Math.random() * (maxRadius - minRadius) + minRadius;
    const x = Math.random() * canvas.width;
    const y = canvas.height + radius; // start just below the bottom
    const speed = Math.random() * 0.7 + 0.6; // px per frame
    const drift = (Math.random() - 0.5) * 0.5; // slight left/right drift
    const alpha = Math.random() * 0.3 + 0.3; // transparency
    // Add a property to indicate not to fill, but to stroke
    return { x, y, radius, speed, drift, alpha, outline: true };
  }

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let running = true;

    // Initial size
    resizeCanvasToWindow(canvas);

    // Handle resize
    function handleResize() {
      resizeCanvasToWindow(canvas);
    }
    window.addEventListener('resize', handleResize);

    // Handle tab visibility change to cull bubbles
    function handleVisibilityChange() {
      if (document.hidden) {
        // Cull all bubbles when tab is hidden (user alt-tabs or switches away)
        bubblesRef.current = [];
        // Also clear the canvas immediately
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Animation
    function animate() {
      if (!running) return;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update and draw bubbles
      bubblesRef.current.forEach(bubble => {
        bubble.y -= bubble.speed;
        bubble.x += bubble.drift;
      });

      // Remove bubbles that are off the top
      bubblesRef.current = bubblesRef.current.filter(
        bubble => bubble.y + bubble.radius > 0
      );

      // Draw bubbles
      for (const bubble of bubblesRef.current) {
        ctx.save();
        ctx.globalAlpha = bubble.alpha;
        ctx.beginPath();
        ctx.arc(bubble.x, bubble.y, bubble.radius, 0, 2 * Math.PI);
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.shadowColor = '#b3e0ff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
      }

      animationRef.current = requestAnimationFrame(animate);
    }

    // Bubble spawner
    function spawnLoop() {
      if (!running) return;
      // Spawn 1-2 bubbles at a time
      const num = Math.random() < 0.7 ? 1 : 2;
      for (let i = 0; i < num; ++i) {
        bubblesRef.current.push(spawnBubble(canvas));
      }
      // Next spawn in 350-900ms
      const next = Math.random() * 550 + 350;
      spawnTimeoutRef.current = setTimeout(spawnLoop, next);
    }

    //call the animation loop
    animate();
    //spawn bubbles
    spawnLoop();

    //disable bubbles 
    return () => {
      running = false;
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (spawnTimeoutRef.current) clearTimeout(spawnTimeoutRef.current);
    };
  }, []);

  // Style: fixed, behind everything, pointer-events none
  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
        display: 'block',
      }}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
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
    <nav className="nav">
      <div className="nav-content">
        <a href="/" className="nav-title">Long live rosa</a>
        <div className="nav-links">
          <a
            href="/art-gallery"
            className="nav-link"
            ref={artGalleryLinkRef}
            onMouseEnter={handleArtGalleryHover}
            onFocus={handleArtGalleryHover}
          >
            Art Gallery
          </a>
          <a href="/Devblog" className="nav-link">Devblog</a>
          <a href="/about" className="nav-link">About</a>
          <a href='/rosa' className='nav-link'>Rosa</a>
          <a href="https://www.youtube.com/@DougDougHaters" className="nav-link">
            <img src="/youtube.png" alt="YouTube" className="nav-logo" />
          </a>
          <a href="https://discord.com/invite/aX6JBrVC" className="nav-link">
            <img src="/Discord.png" alt="Discord" className="nav-logo" />
          </a>
          <a href="https://www.montereybayaquarium.org" className="nav-link">
            <img
              src="/MBALogo.png"
              alt="Monterey Bay Aquarium"
              className="nav-mba-logo"
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
      <BubblesBackground />
      <Navbar />
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
        <h1>Long live rosa game</h1>
        <a
          href="https://github.com/Longliverosa/longliverosa-game"
          target="_blank"
          rel="noopener noreferrer"
          className="github-link"
        >
          <svg
            height="22"
            width="22"
            viewBox="0 0 16 16"
            fill="currentColor"
            style={{ marginRight: '0.5em', verticalAlign: 'middle' }}
            aria-hidden="true"
          >
            /* path for the image used for now we dont host this image change this later */
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
