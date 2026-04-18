import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';

import { getDb, closeDb } from './db/index.js';
import { seedDatabase } from './db/seed.js';
import { runScrapers } from './scrapers/runner.js';
import citiesRouter from './routes/cities.js';
import complianceRouter from './routes/compliance.js';
import geocodeRouter from './routes/geocode.js';
import scrapeRouter from './routes/scrape.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const IS_PROD = process.env.NODE_ENV === 'production';

// Ensure data dir exists
const dataDir = join(__dirname, '../data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

// Init DB + seed
getDb();
seedDatabase();

const app = express();

app.use(cors({ origin: IS_PROD ? process.env.ALLOWED_ORIGIN ?? '*' : '*' }));
app.use(compression());
app.use(express.json());

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
});
app.use('/api', apiLimiter);

// Routes
app.use('/api/cities', citiesRouter);
app.use('/api/compliance', complianceRouter);
app.use('/api/geocode', geocodeRouter);
app.use('/api/scrape', scrapeRouter);

// Health check
app.get('/api/health', (_req, res) => {
  const db = getDb();
  const cityCount = (db.prepare('SELECT COUNT(*) as n FROM cities').get() as { n: number }).n;
  res.json({ status: 'ok', cities: cityCount, timestamp: new Date().toISOString() });
});

// Serve built frontend in production
if (IS_PROD) {
  const distPath = join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')));
}

const server = app.listen(PORT, () => {
  console.log(`✓ STR Compliance API listening on port ${PORT} (${IS_PROD ? 'production' : 'development'})`);

  // Background scrape on startup (non-blocking)
  if (process.env.SCRAPE_ON_STARTUP !== 'false') {
    setTimeout(() => {
      runScrapers().catch(e => console.warn('Startup scrape failed:', e.message));
    }, 2000);
  }
});

// Graceful shutdown
function shutdown(signal: string) {
  console.log(`\n${signal} received — shutting down`);
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

export default app;
