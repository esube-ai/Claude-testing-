import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getDb } from '../db/index.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET ?? 'str-compliance-dev-secret-change-in-prod';

type UserRow = {
  id: string; email: string; name: string; password_hash: string;
  plan: string; checks_this_month: number; checks_reset_at: string; created_at: string;
};

const FREE_MONTHLY_LIMIT = 3;
const PRO_MONTHLY_LIMIT = Infinity;

function makeToken(user: UserRow) {
  return jwt.sign({ id: user.id, email: user.email, plan: user.plan }, JWT_SECRET, { expiresIn: '7d' });
}

function sanitize(user: UserRow) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { password_hash, ...rest } = user;
  return {
    id: rest.id,
    email: rest.email,
    name: rest.name,
    plan: rest.plan,
    checksThisMonth: rest.checks_this_month,
    checksResetAt: rest.checks_reset_at,
    monthlyLimit: rest.plan === 'free' ? FREE_MONTHLY_LIMIT : PRO_MONTHLY_LIMIT,
  };
}

function nextMonthReset() {
  const d = new Date();
  d.setMonth(d.getMonth() + 1, 1);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

router.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, plan = 'free' } = req.body ?? {};
  if (!name || !email || !password) {
    res.status(400).json({ error: 'name, email, and password are required' });
    return;
  }
  if (!['free', 'pro', 'enterprise'].includes(plan)) {
    res.status(400).json({ error: 'Invalid plan' });
    return;
  }
  const db = getDb();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(String(email).toLowerCase());
  if (existing) {
    res.status(409).json({ error: 'Email already registered' });
    return;
  }
  const hash = await bcrypt.hash(String(password), 10);
  const id = randomUUID();
  db.prepare(
    'INSERT INTO users (id, email, name, password_hash, plan, checks_reset_at) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, String(email).toLowerCase().trim(), String(name).trim(), hash, plan, nextMonthReset());
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow;
  res.status(201).json({ user: sanitize(user), token: makeToken(user) });
});

router.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};
  if (!email || !password) {
    res.status(400).json({ error: 'email and password are required' });
    return;
  }
  const db = getDb();
  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(String(email).toLowerCase()) as UserRow | undefined;
  if (!user) { res.status(401).json({ error: 'Invalid email or password' }); return; }
  const valid = await bcrypt.compare(String(password), user.password_hash);
  if (!valid) { res.status(401).json({ error: 'Invalid email or password' }); return; }

  // reset monthly counter if past reset date
  if (new Date() >= new Date(user.checks_reset_at)) {
    db.prepare('UPDATE users SET checks_this_month = 0, checks_reset_at = ? WHERE id = ?')
      .run(nextMonthReset(), user.id);
    user.checks_this_month = 0;
  }

  res.json({ user: sanitize(user), token: makeToken(user) });
});

router.get('/me', (req: Request, res: Response) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) { res.status(401).json({ error: 'No token provided' }); return; }
  try {
    const payload = jwt.verify(auth.slice(7), JWT_SECRET) as { id: string };
    const db = getDb();
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(payload.id) as UserRow | undefined;
    if (!user) { res.status(401).json({ error: 'User not found' }); return; }
    res.json({ user: sanitize(user) });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
