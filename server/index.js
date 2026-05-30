import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db.js';
import Url from './models/User.js';
import urlRoutes from './routes/url.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173'
}));
app.use(express.json());

await connectDB();

app.use('/api', urlRoutes);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.get('/:code', async (req, res) => {
  try {
    const url = await Url.findOneAndUpdate(
      { shortCode: req.params.code },
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ message: 'Short URL not found.' });
    }

    return res.redirect(url.longUrl);
  } catch (error) {
    console.error('Redirect failed:', error);
    return res.status(500).json({ message: 'Redirect failed.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
