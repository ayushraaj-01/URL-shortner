function UrlTable({ urls, onCopy, loading }) {
  if (loading) {
    return <p className="empty-state">Loading saved URLs...</p>;
  }

  if (!urls.length) {
    return <p className="empty-state">No URLs yet. Shorten your first link above.</p>;
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Original URL</th>
            <th>Short URL</th>
            <th>Clicks</th>
            <th>Copy</th>
          </tr>
        </thead>
        <tbody>
          {urls.map((url) => (
            <tr key={url._id || url.id || url.shortCode}>
              <td>
                <a href={url.longUrl} target="_blank" rel="noreferrer" className="table-link">
                  {url.longUrl}
                </a>
              </td>
              <td>
                <a href={url.shortUrl} target="_blank" rel="noreferrer" className="table-link short-url-link">
                  {url.shortUrl}
                </a>
              </td>
              <td>
                <span className="click-count">{url.clicks}</span>
              </td>
              <td>
                <button type="button" className="secondary-button small" onClick={() => onCopy(url.shortUrl)}>
                  Copy
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UrlTable;
