import { Router } from 'express';
import { getDb, rowToCity, type CityRow, type RuleRow } from '../db/index.js';

const router = Router();

router.get('/', (_req, res) => {
  const db = getDb();
  const rows = db.prepare('SELECT * FROM cities ORDER BY name ASC').all() as CityRow[];
  res.json(rows.map(rowToCity));
});

router.get('/:id', (req, res) => {
  const db = getDb();
  const row = db.prepare('SELECT * FROM cities WHERE id = ?').get(req.params.id) as CityRow | undefined;
  if (!row) return res.status(404).json({ error: 'City not found' });

  const rules = db.prepare(
    'SELECT * FROM regulation_rules WHERE city_id = ? ORDER BY sort_order ASC'
  ).all(req.params.id) as RuleRow[];

  return res.json({ ...rowToCity(row), regulationRules: rules });
});

router.get('/:id/scrape-history', (req, res) => {
  const db = getDb();
  const logs = db.prepare(
    'SELECT * FROM scrape_log WHERE city_id = ? ORDER BY scraped_at DESC LIMIT 20'
  ).all(req.params.id);
  res.json(logs);
});

export default router;
