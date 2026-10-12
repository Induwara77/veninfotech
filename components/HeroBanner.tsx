import Link from 'next/link';
import Cover from '@/components/ui/Cover';
import { getLatestPosts, type Post } from '@/lib/posts';

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute right-0 top-0 z-10 bg-flame px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
      {children}
    </span>
  );
}

function SideCard({ post }: { post: Post }) {
  return (
    <Link href={`/posts/${post.slug}`} className="group relative block overflow-hidden bg-night">
      <Cover src={post.image} seed={post.slug} sizes="(min-width: 1024px) 380px, 100vw" className="transition-transform duration-500 group-hover:scale-105" />
      <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent" />
      <Badge>{post.category ?? 'News'}</Badge>
      <h3 className="absolute inset-x-0 bottom-0 line-clamp-2 p-3 text-xs font-bold uppercase leading-snug text-white">
        {post.title}
      </h3>
    </Link>
  );
}

export default async function HeroBanner() {
  const [main, ...rest] = await getLatestPosts(4);
  if (!main) return null;
  const side = rest.slice(0, 3);

  return (
    <section aria-label="Featured stories" className="grid gap-2 lg:h-[380px] lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
      <Link
        href={`/posts/${main.slug}`}
        className={`group relative block min-h-72 overflow-hidden bg-night ${side.length === 0 ? 'lg:col-span-2' : ''}`}
      >
        <Cover src={main.image} seed={main.slug} sizes="(min-width: 1024px) 760px, 100vw" className="transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/30 to-transparent" />
        <Badge>{main.category ?? 'Featured'}</Badge>
        <div className="absolute inset-x-0 bottom-0 p-5">
          <h1 className="text-xl font-extrabold uppercase leading-tight text-white md:text-2xl">
            {main.title}
          </h1>
          <p className="mt-1 line-clamp-2 max-w-2xl text-xs text-neutral-300">{main.excerpt}</p>
        </div>
      </Link>

      {side.length > 0 && (
        <div className="grid min-h-72 grid-rows-3 gap-2">
          {side.map((post) => (
            <SideCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </section>
  );
}
