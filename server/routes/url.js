import express from 'express';
import { customAlphabet } from 'nanoid';
import Url from '../models/User.js';

const router = express.Router();
const generateCode = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

const buildShortUrl = (req, shortCode) => `${req.protocol}://${req.get('host')}/${shortCode}`;

const normalizeUrl = (value) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return '';
  }

  try {
    return new URL(trimmed).toString();
  } catch {
    try {
      return new URL(`https://${trimmed}`).toString();
    } catch {
      return '';
    }
  }
};

router.post('/shorten', async (req, res) => {
  try {
    const normalizedLongUrl = normalizeUrl(req.body.longUrl || '');

    if (!normalizedLongUrl) {
      return res.status(400).json({ message: 'Please provide a valid URL.' });
    }

    let shortCode = generateCode();
    let existingUrl = await Url.findOne({ shortCode });

    while (existingUrl) {
      shortCode = generateCode();
      existingUrl = await Url.findOne({ shortCode });
    }

    const url = await Url.create({
      longUrl: normalizedLongUrl,
      shortCode
    });

    return res.status(201).json({
      message: 'Short URL created successfully.',
      shortCode: url.shortCode,
      shortUrl: buildShortUrl(req, url.shortCode),
      url
    });
  } catch (error) {
    console.error('Failed to shorten URL:', error);
    return res.status(500).json({ message: 'Failed to create short URL.' });
  }
});

router.get('/urls', async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 }).lean();

    const payload = urls.map((url) => ({
      ...url,
      id: url._id,
      shortUrl: buildShortUrl(req, url.shortCode)
    }));

    return res.json(payload);
  } catch (error) {
    console.error('Failed to fetch URLs:', error);
    return res.status(500).json({ message: 'Failed to load URLs.' });
  }
});

export default router;
