import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './ui.jsx'

const container = document.getElementById('root')

const tree = (
  <StrictMode>
    {/* Last resort: if the failure is in the nav or the router itself,
        the page-level boundary inside App never gets the chance to catch it. */}
    <ErrorBoundary full>
      <App />
    </ErrorBoundary>
  </StrictMode>
)

// The build prerenders every route, so in production there is markup here to
// adopt rather than replace -- that markup is what a member on a slow
// connection is already reading. A dev server, or a route the prerender could
// not produce, leaves the container empty and we mount normally.
if (container.hasChildNodes()) hydrateRoot(container, tree)
else createRoot(container).render(tree)
