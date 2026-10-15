import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function cleanAllBlogs() {
  try {
    const deleted = await sql`DELETE FROM posts RETURNING id, slug, title`;
    console.log(`Successfully removed ${deleted.length} blogs from Neon DB.`);
    deleted.forEach((d) => console.log(` - Removed: [${d.id}] ${d.slug} ("${d.title}")`));

    const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM posts`;
    console.log(`Total remaining posts in DB: ${count}`);
  } catch (err) {
    console.error('Failed to clear posts:', err);
    process.exit(1);
  }
}

cleanAllBlogs();
