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

  const sortedUrls = useMemo(() => urls, [urls]);

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
    await navigator.clipboard.writeText(value);
  };

  return (
    <main className="page-shell">
      <section className="hero-card">
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
    </main>
  );
}

export default App;
