import { useState } from 'react';

function UrlForm({ onShorten, isSubmitting, error, shortUrl, onCopy }) {
  const [longUrl, setLongUrl] = useState('');
  const [copyMessage, setCopyMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!longUrl.trim()) {
      return;
    }

    await onShorten(longUrl);
    setCopyMessage('');
  };

  const handleCopy = async () => {
    await onCopy(shortUrl);
    setCopyMessage('Copied to clipboard');
  };

  return (
    <div className="form-card">
      <form onSubmit={handleSubmit} className="shorten-form">
        <label htmlFor="longUrl">Long URL</label>
        <div className="form-row">
          <input
            id="longUrl"
            type="url"
            placeholder="https://example.com/very/long/link"
            value={longUrl}
            onChange={(event) => setLongUrl(event.target.value)}
            autoComplete="off"
            required
          />
          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Shortening...' : 'Shorten'}
          </button>
        </div>
      </form>

      {error ? <p className="message error">{error}</p> : null}

      {shortUrl ? (
        <div className="result-box">
          <div>
            <p className="result-label">Generated short URL</p>
            <a href={shortUrl} target="_blank" rel="noreferrer" className="short-link">
              {shortUrl}
            </a>
          </div>
          <div className="result-actions">
            <button type="button" className="secondary-button" onClick={handleCopy}>
              Copy
            </button>
            {copyMessage ? <span className="message success">{copyMessage}</span> : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UrlForm;
