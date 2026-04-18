import { Router } from 'express';
import { getDb, type CityRow, type RuleRow } from '../db/index.js';
import { runComplianceEngine, type Answers } from '../compliance/engine.js';

const router = Router();

router.post('/', (req, res) => {
  const { cityId, answers } = req.body as { cityId: string; answers: Answers };

  if (!cityId || typeof cityId !== 'string') {
    return res.status(400).json({ error: 'cityId is required' });
  }
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'answers object is required' });
  }

  const db = getDb();
  const cityRow = db.prepare('SELECT * FROM cities WHERE id = ?').get(cityId) as CityRow | undefined;
  if (!cityRow) return res.status(404).json({ error: 'City not found' });

  const ruleRows = db.prepare(
    'SELECT * FROM regulation_rules WHERE city_id = ? ORDER BY sort_order ASC'
  ).all(cityId) as RuleRow[];

  const result = runComplianceEngine(cityRow, ruleRows, answers);
  return res.json(result);
});

export default router;
