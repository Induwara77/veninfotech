import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { sql } from '@/lib/db';
import Link from 'next/link';

export const instant = false; // Prevents Next.js 16 prerender blocking errors on dynamic DB calls

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Automatically increment the view count in Neon Postgres when the page loads
  try {
    await sql`
      INSERT INTO post_views (slug, view_count) 
      VALUES (${slug}, 1) 
      ON CONFLICT (slug) 
      DO UPDATE SET view_count = post_views.view_count + 1;
    `;
  } catch (err) {
    console.error('Failed to increment view count:', err);
  }

  // 2. Fetch the updated view count to display on the page
  let views = 0;
  try {
    const viewResult = await sql`
      SELECT view_count FROM post_views WHERE slug = ${slug}
    `;
    if (viewResult.length > 0) {
      views = viewResult[0].view_count;
    }
  } catch (err) {
    views = 0;
  }

  // 3. Read the specific markdown file based on the slug
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 p-8 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Post not found</h1>
        <Link href="/" className="text-sky-400 hover:underline">&larr; Back to home</Link>
      </div>
    );
  }

  const markdownWithMeta = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(markdownWithMeta);
  const htmlContent = marked(content);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto py-12">
        <Link href="/" className="text-sm text-sky-400 hover:underline mb-8 inline-block">
          &larr; Back to home
        </Link>

        <header className="mb-8 border-b border-zinc-800 pb-6">
          <div className="flex justify-between items-center text-xs text-zinc-500 font-mono mb-2">
            <span>{data.date}</span>
            <span>{views} views</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">{data.title}</h1>
          <p className="text-zinc-400">{data.excerpt}</p>
        </header>

        <article 
          className="prose prose-invert max-w-none text-zinc-300 space-y-4"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </main>
  );
}