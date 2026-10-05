import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { LOGO_SOURCES } from './lib/media'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Gebruik het officiële logo als favicon zodra het bestand in public/brand/ staat.
function setFaviconFromLogo(sources: string[]) {
  const [src, ...rest] = sources
  if (!src) return
  const probe = new Image()
  probe.onload = () => {
    const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]')
    if (link) {
      link.href = src
      link.type = src.endsWith('.svg') ? 'image/svg+xml' : 'image/png'
    }
  }
  probe.onerror = () => setFaviconFromLogo(rest)
  probe.src = src
}
setFaviconFromLogo(LOGO_SOURCES)
