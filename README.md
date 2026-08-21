# URL Shortener

A full-stack URL shortener built with React, Node.js, and Express. Paste a long URL to create a short shareable link with click tracking.

## Live URL

Visit the deployed app: [https://url-shortner-coral-rho.vercel.app](https://url-shortner-coral-rho.vercel.app)

## Run Locally

Requirements: Node.js 18 or newer.

Install dependencies:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Start the client and server together:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173` and the API runs at `http://localhost:5000`.

## API

- `POST /api/shorten` creates a short URL.
- `GET /api/urls` lists saved URLs.
- `GET /:code` redirects to the original URL and increments its click count.

## Storage

The app currently uses an in-memory store, so shortened URLs and click counts are cleared whenever the server restarts.
