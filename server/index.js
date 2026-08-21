import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { findUrlByCode } from './store.js';
import urlRoutes from './routes/url.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', urlRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/:code', async (req, res) => {
  try {
    const url = findUrlByCode(req.params.code);

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found.' });
    }

    url.clicks += 1;
    return res.redirect(url.longUrl);
  } catch (error) {
    console.error('Redirect failed:', error);
    return res.status(500).json({ message: 'Redirect failed.' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
});