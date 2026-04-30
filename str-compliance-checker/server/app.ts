import express from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { getDb } from './db/index.js';
import citiesRouter from './routes/cities.js';
import complianceRouter from './routes/compliance.js';
import geocodeRouter from './routes/geocode.js';
import scrapeRouter from './routes/scrape.js';
import authRouter from './routes/auth.js';

const IS_PROD = process.env.NODE_ENV === 'production';

export function createApp() {
  const app = express();

  app.use(cors({ origin: '*' }));
  app.use(compression());
  app.use(express.json());

  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });
  app.use('/api', apiLimiter);

  app.use('/api/auth', authRouter);
  app.use('/api/cities', citiesRouter);
  app.use('/api/compliance', complianceRouter);
  app.use('/api/geocode', geocodeRouter);
  app.use('/api/scrape', scrapeRouter);

  app.get('/api/health', (_req, res) => {
    const db = getDb();
    const { n } = db.prepare('SELECT COUNT(*) as n FROM cities').get() as { n: number };
    res.json({ status: 'ok', cities: n, timestamp: new Date().toISOString() });
  });

  return app;
}

export default IS_PROD;
