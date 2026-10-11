import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { sql } from '@/lib/db';

export const instant = false; // Allows dynamic database queries on the homepage

export default async function Home() {
  // 1. Read markdown files from the content directory
  const files = fs.readdirSync(path.join(process.cwd(), 'content'));

  const posts = await Promise.all(
    files.map(async (filename) => {
      const slug = filename.replace('.md', '');
      const markdownWithMeta = fs.readFileSync(
        path.join(process.cwd(), 'content', filename),
        'utf-8'
      );
      const { data } = matter(markdownWithMeta);

      // 2. Fetch view count from Neon Postgres (safely handles if table doesn't exist yet)
      let views = 0;
      try {
        const result = await sql`
          SELECT view_count FROM post_views WHERE slug = ${slug}
        `;
        if (result.length > 0) {
          views = result[0].view_count;
        }
      } catch (err) {
        views = 0;
      }

      return {
        slug,
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
        views,
      };
    })
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto py-12">
        <header className="mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Developer Blog</h1>
          <p className="text-zinc-400">Engineering insights and building in public.</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-zinc-200 mb-4">Latest Posts</h2>
          {posts.map((post) => (
            <article 
              key={post.slug} 
              className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40 hover:border-zinc-700 transition"
            >
              <div className="flex justify-between items-center text-xs text-zinc-500 font-mono mb-1">
                <span>{post.date}</span>
                <span>{post.views} views</span>
              </div>
              <h3 className="text-2xl font-bold mt-1 mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:text-sky-400 transition">
                  {post.title}
                </Link>
              </h3>
              <p className="text-zinc-400 mb-4">{post.excerpt}</p>
              <Link 
                href={`/posts/${post.slug}`} 
                className="text-sm font-medium text-sky-400 hover:underline inline-flex items-center"
              >
                Read article &rarr;
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}