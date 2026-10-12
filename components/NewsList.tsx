import Link from 'next/link';
import Cover from '@/components/ui/Cover';
import { getAllPosts } from '@/lib/posts';

const TABS = [
  { id: 'popular', label: 'Most read' },
  { id: 'latest', label: 'Latest' },
] as const;
type TabId = (typeof TABS)[number]['id'];

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export default async function NewsList({
  searchParams,
  limit = 5,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  limit?: number;
}) {
  const { tab: rawTab } = await searchParams;
  const tab: TabId = TABS.find((t) => t.id === rawTab)?.id ?? 'popular';

  const posts = (await getAllPosts())
    .toSorted((a, b) => (tab === 'popular' ? b.views - a.views : b.timestamp - a.timestamp))
    .slice(0, limit);

  return (
    <section aria-labelledby="news-heading">
      <h2 id="news-heading" className="sr-only">News</h2>

      <nav aria-label="News tabs" className="flex gap-1 border-b border-neutral-300 text-sm">
        {TABS.map((t) => {
          const active = t.id === tab;
          return (
            <Link
              key={t.id}
              href={`/?tab=${t.id}`}
              scroll={false}
              aria-current={active ? 'page' : undefined}
              className={`-mb-px border px-4 py-2 font-medium transition-colors ${
                active
                  ? 'border-neutral-300 border-b-card bg-card text-brand'
                  : 'border-transparent text-neutral-500 hover:text-brand'
              }`}
            >
              {t.label}
            </Link>
          );
        })}
      </nav>

      {posts.length === 0 ? (
        <p className="mt-4 rounded-sm bg-card p-6 text-sm text-neutral-500">No posts yet.</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {posts.map((post) => (
            <li key={post.slug} className="flex gap-4 rounded-sm bg-card p-3 shadow-sm">
              <Link
                href={`/posts/${post.slug}`}
                tabIndex={-1}
                aria-hidden
                className="relative h-20 w-28 shrink-0 overflow-hidden bg-night"
              >
                <Cover src={post.image} seed={post.slug} sizes="112px" />
              </Link>

              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-bold uppercase tracking-wide text-neutral-900">
                  <Link href={`/posts/${post.slug}`} className="hover:text-brand">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-0.5 text-xs text-neutral-400">{post.date}</p>
                <p className="mt-1 line-clamp-2 text-sm text-neutral-600">{post.excerpt}</p>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="inline-flex items-center gap-1 text-neutral-500">
                    <EyeIcon />
                    {post.views.toLocaleString('en-US')} views
                  </span>
                  <Link href={`/posts/${post.slug}`} className="font-semibold text-brand hover:underline">
                    Read more →
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
