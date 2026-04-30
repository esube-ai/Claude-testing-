import { Router } from 'express';
import { runScrapers } from '../scrapers/runner.js';
import { getDb } from '../db/index.js';

const router = Router();

// GET /api/scrape/status — show last scrape per city
router.get('/status', (_req, res) => {
  const db = getDb();
  const rows = db.prepare(`
    SELECT c.id, c.name, c.scrape_status, c.scraped_at, c.last_updated,
           sl.status AS last_run_status, sl.changes_detected, sl.source_url
    FROM cities c
    LEFT JOIN scrape_log sl ON sl.city_id = c.id
      AND sl.scraped_at = (SELECT MAX(scraped_at) FROM scrape_log WHERE city_id = c.id)
    ORDER BY c.name ASC
  `).all();
  res.json(rows);
});

// POST /api/scrape — trigger a scrape run (admin/background)
router.post('/', async (req, res) => {
  const { cityIds } = req.body as { cityIds?: string[] };

  // Respond immediately, run in background
  res.json({ message: 'Scrape started', cities: cityIds ?? 'all' });

  try {
    await runScrapers(cityIds);
    console.log('Background scrape complete');
  } catch (e) {
    console.error('Background scrape error:', e);
  }
});

export default router;
