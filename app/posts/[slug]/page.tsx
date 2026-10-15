import { getPostBySlug } from '@/lib/posts';
import { sql } from '@/lib/db';
import { marked } from 'marked';
import Link from 'next/link';
import Image from 'next/image';

export const instant = false; // Prevents Next.js prerender blocking errors on dynamic DB calls

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;

  // 1. Fetch post from database (with fallback to markdown)
  const post = await getPostBySlug(slug);

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white p-8 flex flex-col items-center justify-center">
        <div className="max-w-md text-center">
          <span className="text-4xl">📰</span>
          <h1 className="text-3xl font-bold mt-4 mb-2 text-white">Post not found</h1>
          <p className="text-neutral-400 mb-6 text-sm">
            The article you are looking for does not exist or may have been unpublished.
          </p>
          <div className="flex justify-center">
            <Link
              href="/"
              className="bg-[#1365A4] px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-white hover:bg-[#0e4c7c] transition-colors"
            >
              &larr; Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Increment view count in Neon DB
  let currentViews = post.views || 0;
  try {
    const updated = await sql`
      INSERT INTO post_views (slug, view_count) 
      VALUES (${slug}, 1) 
      ON CONFLICT (slug) 
      DO UPDATE SET view_count = post_views.view_count + 1
      RETURNING view_count;
    `;
    if (updated && updated.length > 0) {
      currentViews = Number(updated[0].view_count);
    }
  } catch (err) {
    console.error('Failed to increment view count:', err);
  }

  // 3. Parse Markdown content to HTML
  const htmlContent = marked(post.content || post.excerpt || '');

  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-100">
      {/* Top Navigation Bar */}
      <div className="border-b border-neutral-800 bg-neutral-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white transition-colors"
          >
            <span>&larr; Back to Home</span>
          </Link>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        {/* Header Section */}
        <header className="mb-8">
          <div className="flex flex-wrap items-center gap-2.5 text-xs font-medium uppercase tracking-wider text-neutral-400 mb-4">
            <span className="bg-[#1365A4] text-white px-2.5 py-0.5 text-[11px] font-bold">
              {post.category || 'BLOG'}
            </span>
            <span>•</span>
            <span>{post.date}</span>
            <span>•</span>
            <span>By {post.author || 'Editorial Team'}</span>
            <span>•</span>
            <span className="font-mono text-neutral-400">{currentViews.toLocaleString('en-US')} views</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-4 text-base sm:text-lg text-neutral-300 leading-relaxed font-normal border-l-2 border-[#1365A4] pl-4 italic">
              {post.excerpt}
            </p>
          )}
        </header>

        {/* Featured Cover Image */}
        {post.image && (
          <div className="relative w-full h-[260px] sm:h-[420px] md:h-[480px] overflow-hidden rounded-sm mb-10 bg-neutral-900 shadow-xl">
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <div
          className="prose prose-invert prose-neutral max-w-none 
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white
            prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg
            prose-a:text-[#70baff] prose-a:underline hover:prose-a:text-white
            prose-strong:text-white prose-code:text-[#70baff] prose-code:bg-neutral-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800
            prose-img:rounded-md prose-blockquote:border-l-[#1365A4] prose-blockquote:text-neutral-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Footer / Author Bar */}
        <div className="mt-14 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-[#1365A4] flex items-center justify-center font-bold text-white text-sm">
              {(post.author || 'E').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{post.author || 'Editorial Team'}</p>
              <p className="text-xs text-neutral-400">Published on {post.date}</p>
            </div>
          </div>

          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white"
          >
            <span>&larr; More stories on feed</span>
          </Link>
        </div>
      </article>
    </main>
  );
}