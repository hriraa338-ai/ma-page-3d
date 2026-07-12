import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import LeadGenerationPage from './pages/LeadGenerationPage.tsx'

// Minimal hash-based switch so both demos are viewable:
//   default        -> Lithos hero (App)
//   #leadgen       -> integrated LeadGen landing page
function Root() {
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const onHashChange = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  return route === '#leadgen' ? <LeadGenerationPage /> : <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)
