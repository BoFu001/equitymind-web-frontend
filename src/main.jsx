import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// iOS Safari ignores user-scalable=no in the viewport meta, and only
// partly honours touch-action, so pinch-zoom still gets through. The
// gesture events are Safari-specific and are what it actually listens
// to; blocking them leaves scrolling untouched.
document.addEventListener('gesturestart', (e) => e.preventDefault())
document.addEventListener('gesturechange', (e) => e.preventDefault())
document.addEventListener('gestureend', (e) => e.preventDefault())

// A double tap zooms too, on a separate path from the pinch gesture.
let lastTouchEnd = 0
document.addEventListener('touchend', (e) => {
  const now = Date.now()
  if (now - lastTouchEnd < 300) e.preventDefault()
  lastTouchEnd = now
}, { passive: false })
