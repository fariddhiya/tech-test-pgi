const { readFileSync, readdirSync } = require('fs');
const { join } = require('path');
const { Pool } = require('pg');

function loadMigrationFiles(dir) {
  const files = readdirSync(dir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  return files.map((file) => {
    const content = readFileSync(join(dir, file), 'utf-8');
    const upMatch = content.match(
      /-- migrate:up\s*\n([\s\S]*?)(?=-- migrate:down|$)/,
    );
    const downMatch = content.match(/-- migrate:down\s*\n([\s\S]*?)$/);

    return {
      name: file,
      up: upMatch ? upMatch[1].trim() : '',
      down: downMatch ? downMatch[1].trim() : '',
    };
  });
}

async function runMigrations() {
  const pool = new Pool({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
    user: process.env.POSTGRES_USER || 'backend_user',
    password: process.env.POSTGRES_PASSWORD || 'secretpassword',
    database: process.env.POSTGRES_DATABASE || 'siem_db',
  });

  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL UNIQUE,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const appliedResult = await pool.query(
      'SELECT name FROM schema_migrations ORDER BY id',
    );
    const applied = new Set(appliedResult.rows.map((r) => r.name));

    const migrationsDir = join(__dirname, '..', 'migrations');
    const migrations = loadMigrationFiles(migrationsDir);

    for (const migration of migrations) {
      if (applied.has(migration.name)) {
        console.log(`Skipping already applied migration: ${migration.name}`);
        continue;
      }

      console.log(`Applying migration: ${migration.name}`);
      await pool.query('BEGIN');

      try {
        await pool.query(migration.up);
        await pool.query('INSERT INTO schema_migrations (name) VALUES ($1)', [
          migration.name,
        ]);
        await pool.query('COMMIT');
        console.log(`Successfully applied: ${migration.name}`);
      } catch (error) {
        await pool.query('ROLLBACK');
        console.error(`Failed to apply migration ${migration.name}:`, error);
        throw error;
      }
    }

    console.log('All migrations applied successfully');
  } finally {
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
