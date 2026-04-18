import 'dotenv/config';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync } from 'fs';
import { getDb, closeDb } from './db/index.js';
import { seedDatabase } from './db/seed.js';
import { runScrapers } from './scrapers/runner.js';
import { createApp } from './app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = parseInt(process.env.PORT ?? '3001', 10);
const IS_PROD = process.env.NODE_ENV === 'production';

// Ensure data dir exists for file-based SQLite
const dataDir = join(__dirname, '../data');
if (!existsSync(dataDir)) mkdirSync(dataDir, { recursive: true });

// Init DB + seed
getDb();
seedDatabase();

const app = createApp();

// Serve built frontend in production
if (IS_PROD) {
  const { default: express } = await import('express');
  const distPath = join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.get('*', (_req, res) => res.sendFile(join(distPath, 'index.html')));
}

const server = app.listen(PORT, () => {
  console.log(`✓ STR Compliance API on :${PORT} (${IS_PROD ? 'production' : 'development'})`);
  if (process.env.SCRAPE_ON_STARTUP !== 'false') {
    setTimeout(() => {
      runScrapers().catch(e => console.warn('Startup scrape failed:', e.message));
    }, 2000);
  }
});

function shutdown(signal: string) {
  console.log(`\n${signal} — shutting down`);
  server.close(() => { closeDb(); process.exit(0); });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
