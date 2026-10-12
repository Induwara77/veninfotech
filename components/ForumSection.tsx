import Link from 'next/link';
import type { ForumThread } from '@/lib/types';

function DateBadge({ iso }: { iso: string }) {
  const d = new Date(iso);
  const day = String(d.getUTCDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short', timeZone: 'UTC' }).toUpperCase();
  const year = d.getUTCFullYear();
  return (
    <div className="w-16 shrink-0 bg-white py-2 text-center text-night">
      <p className="text-lg font-extrabold leading-none">{day}</p>
      <p className="text-[10px] font-bold">{month}</p>
      <p className="text-[10px] font-bold text-brand">{year}</p>
    </div>
  );
}

export default function ForumSection({
  title = 'From the forum',
  threads,
}: {
  title?: string;
  threads: ForumThread[];
}) {
  return (
    <section aria-labelledby="forum-heading">
      <h2 id="forum-heading" className="text-lg font-bold text-white">{title}</h2>
      <div className="mt-1 h-0.5 w-12 bg-brand" />
      <p className="mt-2 text-xs text-neutral-500">What the community is talking about right now.</p>

      <ul className="mt-8 space-y-3">
        {threads.map((t) => (
          <li key={t.id} className="flex gap-3 bg-night-2 p-3">
            <DateBadge iso={t.date} />
            <div className="min-w-0">
              <h3 className="text-sm font-bold leading-snug text-white">
                <Link href={t.href} className="hover:text-brand">{t.title}</Link>
              </h3>
              <p className="text-[11px] text-brand">by {t.author}</p>
              <p className="mt-1 line-clamp-2 text-xs text-neutral-400">{t.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>

      <Link
        href="#"
        className="mt-6 inline-block rounded-full border border-white/30 px-6 py-2 text-[11px] font-semibold uppercase tracking-wider text-white transition-colors hover:border-brand hover:text-brand"
      >
        Go to forum
      </Link>
    </section>
  );
}
