import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignIn from './login.jsx'
import SignUp from './Sign-up.jsx'
import AdminPanel from './admin_pannel.jsx'
import ArtGallery from './Art_gallary.jsx'
import DevBlog from './dev_blog.jsx'
import About from './about.jsx'
import Rosa from './rossa.jsx'
import ApproveRosa from './approve-rosa.jsx'


// Helper component to control background color based on route
function BackgroundController() {
  const location = useLocation()

  useEffect(() => {
    // Default background color from index.css
    let defaultBg = '#3399ff'
    // If on /admin or /signup, set to default (in case login.css overrides)
    if (location.pathname === '/admin' || location.pathname === '/signup') {
      document.body.style.backgroundColor = defaultBg
    } else {
      // For all other routes, also enforce default background
      document.body.style.backgroundColor = defaultBg
    }
    // Optionally, clean up on unmount
    return () => {
      document.body.style.backgroundColor = defaultBg
    }
  }, [location.pathname])

  return null
}

//all the routes the site 
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <BackgroundController />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/art-gallery" element={<ArtGallery />} />
        <Route path="/Devblog" element={<DevBlog/>} />
        <Route path="/about" element={<About/>} />
        <Route path="/admin" element={<SignIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/admin-panel" element={<AdminPanel/>} />
        <Route path="/rosa" element={<Rosa />} />
        <Route path='/rosa-approve'element={<ApproveRosa/>}/>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
