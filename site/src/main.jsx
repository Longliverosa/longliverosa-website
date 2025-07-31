import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

// Dynamic imports for route components
import App from './App.jsx'
const SignIn = lazy(() => import('./login.jsx'))
const SignUp = lazy(() => import('./Sign-up.jsx'))
const AdminPanel = lazy(() => import('./admin_pannel.jsx'))
const ArtGallery = lazy(() => import('./Art_gallary.jsx'))
const DevBlog = lazy(() => import('./dev_blog.jsx'))
const About = lazy(() => import('./about.jsx'))
const Rosa = lazy(() => import('./rossa.jsx'))
const ApproveRosa = lazy(() => import('./approve-rosa.jsx'))

// No need for BackgroundController anymore; index.css handles navbar and background

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/art-gallery" element={<ArtGallery />} />
          <Route path="/Devblog" element={<DevBlog />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="/rosa" element={<Rosa />} />
          <Route path="/rosa-approve" element={<ApproveRosa />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  </StrictMode>,
)
