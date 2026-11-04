import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Dynamic SEO Canonical Link & OpenGraph URL Resolution
try {
  let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!canonicalLink) {
    canonicalLink = document.createElement('link');
    canonicalLink.setAttribute('rel', 'canonical');
    document.head.appendChild(canonicalLink);
  }
  canonicalLink.href = window.location.origin + window.location.pathname;

  let ogUrl = document.querySelector('meta[property="og:url"]') as HTMLMetaElement | null;
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.content = window.location.origin + window.location.pathname;
} catch {
  // safe fallback
}

function mountApp() {
  const container = document.getElementById('root') || document.getElementById('mortgage-app-root');
  if (container && !(container as any)._reactRoot) {
    const root = createRoot(container);
    (container as any)._reactRoot = root;
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );

    // Dismiss instant native preloader overlay smoothly
    requestAnimationFrame(() => {
      const preloader = document.getElementById('app-preloader');
      if (preloader) {
        preloader.style.transition = 'opacity 0.25s ease-out';
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.remove();
        }, 260);
      }
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}
