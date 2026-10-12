import Link from 'next/link';
import Cover from '@/components/ui/Cover';
import type { Reviewer } from '@/lib/types';

function Stars({ rating }: { rating: number }) {
  return (
    <span role="img" aria-label={`${rating} out of 5`} className="text-[11px] tracking-widest">
      <span className="text-gold">{'★'.repeat(rating)}</span>
      <span className="text-neutral-600">{'★'.repeat(5 - rating)}</span>
    </span>
  );
}

export default function SidebarTopRated({
  title = 'Top reviewers',
  reviewers,
}: {
  title?: string;
  reviewers: Reviewer[];
}) {
  if (reviewers.length === 0) return null;

  return (
    <section aria-labelledby="top-rated-heading" className="shadow-sm">
      <h2
        id="top-rated-heading"
        className="bg-violet px-4 py-2 text-xs font-extrabold uppercase tracking-widest text-white"
      >
        {title}
      </h2>
      <ul className="bg-night">
        {reviewers.map((r) => (
          <li key={r.id} className="flex items-center gap-3 border-b border-white/10 p-2.5 last:border-0">
            <div className="relative size-10 shrink-0 overflow-hidden rounded-sm">
              <Cover src={r.avatarUrl} alt={r.name} seed={r.id} sizes="40px" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{r.name}</p>
              <Stars rating={Math.min(5, Math.max(0, Math.round(r.rating)))} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wide text-neutral-500">{r.game}</span>
          </li>
        ))}
      </ul>
      <Link
        href="#"
        className="block bg-night-2 py-2 text-center text-[11px] font-semibold uppercase tracking-wider text-neutral-300 transition-colors hover:text-brand"
      >
        View more
      </Link>
    </section>
  );
}
