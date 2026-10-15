import fs from 'node:fs/promises';
import path from 'node:path';
import { neon } from '@neondatabase/serverless';
try {
  process.loadEnvFile('.env.local');
} catch {}

async function clean() {
  const contentDir = path.join(process.cwd(), 'content');
  try {
    const files = await fs.readdir(contentDir);
    for (const f of files) {
      if (f.endsWith('.md')) {
        await fs.unlink(path.join(contentDir, f));
        console.log('Deleted markdown file:', f);
      }
    }
  } catch (e) {
    console.log('Content directory info:', e.message);
  }

  const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (dbUrl) {
    const sql = neon(dbUrl);
    await sql`DELETE FROM posts`;
    await sql`DELETE FROM post_views`;
    console.log('Successfully cleared all posts and views from Neon database.');
  } else {
    console.warn('DATABASE_URL not found in .env.local');
  }

  try {
    const res = await fetch('http://localhost:3000/api/posts?status=all');
    const data = await res.json();
    console.log('Current posts in system after cleanup:', data.posts?.length ?? 0);
  } catch (err) {
    console.warn('Could not query dev server:', err.message);
  }
}

clean().catch(console.error);
