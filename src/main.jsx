import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './ui.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Last resort: if the failure is in the nav or the router itself,
        the page-level boundary inside App never gets the chance to catch it. */}
    <ErrorBoundary full>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
