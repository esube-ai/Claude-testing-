// Vercel serverless entry point.
// Each cold start gets a fresh in-memory SQLite DB, seeded immediately.
import { getDb } from '../server/db/index.js';
import { seedDatabase } from '../server/db/seed.js';
import { createApp } from '../server/app.js';

// Init + seed synchronously before any request is handled
getDb();
seedDatabase();

const app = createApp();

export default app;
