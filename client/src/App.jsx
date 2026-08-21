import { useEffect, useMemo, useState } from 'react';
import UrlForm from './components/UrlForm';
import UrlTable from './components/UrlTable';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

function App() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [theme, setTheme] = useState(() => {
    const savedTheme = window.localStorage.getItem('url-shortener-theme');
    return savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  });

  const sortedUrls = useMemo(() => urls, [urls]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('url-shortener-theme', theme);
  }, [theme]);

  const loadUrls = async () => {
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/urls`);
      if (!response.ok) {
        throw new Error('Unable to load shortened URLs.');
      }

      const data = await response.json();
      setUrls(data);
    } catch (fetchError) {
      setError(fetchError.message || 'Unable to load shortened URLs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUrls();
  }, []);

  const shortenUrl = async (longUrl) => {
    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/shorten`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ longUrl })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Unable to shorten URL.');
      }

      setShortUrl(data.shortUrl);
      await loadUrls();
      return data.shortUrl;
    } catch (submitError) {
      setError(submitError.message || 'Unable to shorten URL.');
      throw submitError;
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = async (value) => {
    try {
      await navigator.clipboard.writeText(value);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <main className="page-shell">
      <header className="top-bar">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 32 32" role="img">
              <path d="M12 20.5 9.8 22.7a5 5 0 0 1-7.1-7.1l4.1-4.1a5 5 0 0 1 7.1 0" />
              <path d="m20 11.5 2.2-2.2a5 5 0 0 1 7.1 7.1l-4.1 4.1a5 5 0 0 1-7.1 0" />
              <path d="m10 22 12-12" />
            </svg>
          </span>
          <span className="brand-name">Linkfolk</span>
        </div>

        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          aria-pressed={theme === 'dark'}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          <svg key={theme} className="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
            {theme === 'light' ? (
              <path d="M20.2 15.2A8.5 8.5 0 0 1 8.8 3.8 8.5 8.5 0 1 0 20.2 15.2Z" />
            ) : (
              <path d="M12 3v2m0 14v2M3 12h2m14 0h2m-3.4-6.6-1.4 1.4M7.8 16.2l-1.4 1.4m0-12.8 1.4 1.4m8.4 8.4 1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />
            )}
          </svg>
        </button>
      </header>

      <section className="hero-card">
        <span className="doodle doodle-spark" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <path d="M32 6c1.4 15.8 2.2 17.2 17 20-14.8 2.8-15.6 4.2-17 20-1.4-15.8-2.2-17.2-17-20 14.8-2.8 15.6-4.2 17-20Z" />
            <path d="M49 8c.5 5.8.8 6.3 6 7-5.2.7-5.5 1.2-6 7-.5-5.8-.8-6.3-6-7 5.2-.7 5.5-1.2 6-7Z" />
          </svg>
        </span>
        <span className="doodle doodle-chain" aria-hidden="true">
          <svg viewBox="0 0 80 64">
            <path d="M27 42 20 49a11 11 0 0 1-16-16l10-10a11 11 0 0 1 16 0" />
            <path d="m53 22 7-7a11 11 0 0 1 16 16L66 41a11 11 0 0 1-16 0" />
            <path d="m25 39 30-14" />
          </svg>
        </span>
        <span className="doodle doodle-arrow" aria-hidden="true">
          <svg viewBox="0 0 96 64">
            <path d="M7 14c20 25 42 37 77 26" />
            <path d="m68 26 17 14-20 6" />
          </svg>
        </span>
        <div className="hero-copy">
          <p className="eyebrow">URL Shortener</p>
          <h1>Shorten links, track clicks, and copy them in one place.</h1>
          <p className="hero-text">
            Paste any long URL, generate a clean short link, and keep an eye on how many times it gets opened.
          </p>
        </div>

        <UrlForm
          onShorten={shortenUrl}
          isSubmitting={submitting}
          error={error}
          shortUrl={shortUrl}
          onCopy={copyToClipboard}
        />
      </section>

      <section className="table-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Saved Links</p>
            <h2>All shortened URLs</h2>
          </div>
          <span className="count-pill">{sortedUrls.length} saved</span>
        </div>

        <UrlTable urls={sortedUrls} onCopy={copyToClipboard} loading={loading} />
      </section>

      <footer className="site-footer">
        <span className="doodle doodle-footer" aria-hidden="true">
          <svg viewBox="0 0 64 32">
            <path d="M5 18c11-12 20-12 27 0 7 12 16 12 27 0" />
          </svg>
        </span>
        <span>Made with love by Ayush</span>
      </footer>
    </main>
  );
}

export default App;
