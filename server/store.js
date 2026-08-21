import { randomUUID } from 'node:crypto';

const urls = [];

export const createUrl = ({ longUrl, shortCode }) => {
  const url = {
    id: randomUUID(),
    longUrl,
    shortCode,
    clicks: 0,
    createdAt: new Date().toISOString()
  };

  urls.unshift(url);
  return url;
};

export const findUrlByCode = (shortCode) => urls.find((url) => url.shortCode === shortCode);

export const listUrls = () => [...urls];