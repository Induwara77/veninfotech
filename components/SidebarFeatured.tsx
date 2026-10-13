import Link from 'next/link';
import Cover from '@/components/ui/Cover';
import type { FeaturedGame } from '@/lib/types';

export default function SidebarFeatured({
  title = 'Featured game',
  game,
}: {
  title?: string;
  game: FeaturedGame;
}) {
  return (
    <section aria-labelledby="featured-heading" className="shadow-sm">
      <h2
        id="featured-heading"
        className="bg-gold px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white"
      >
        {title}
      </h2>
      <div className="flex items-center gap-3 bg-card p-3">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-sm">
          <Cover src={game.imageUrl} alt={game.title} seed={game.id} sizes="64px" />
        </div>
        <div className="min-w-0">
          <h3 className="text-sm font-bold text-neutral-900">{game.title}</h3>
          <p className="line-clamp-2 text-xs text-neutral-500">{game.tagline}</p>
          <Link
            href={game.href}
            className="mt-2 inline-block bg-brand px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-white transition-colors hover:bg-brand/80"
          >
            View
          </Link>
        </div>
      </div>
    </section>
  );
}
