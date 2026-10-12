import Image from 'next/image';
import Link from 'next/link';
import type { Sponsor } from '@/lib/types';

export default function SponsorBar({
  title = 'Our sponsors',
  sponsors,
}: {
  title?: string;
  sponsors: Sponsor[];
}) {
  if (sponsors.length === 0) return null;

  return (
    <section aria-label={title} className="flex overflow-hidden bg-card shadow-sm">
      <div className="flex w-28 shrink-0 items-center bg-brand px-4 py-3 text-xs font-extrabold uppercase leading-tight tracking-wide text-white [clip-path:polygon(0_0,100%_0,calc(100%-20px)_100%,0_100%)] sm:w-44 sm:text-sm">
        {title}
      </div>
      <ul className="grid flex-1 grid-cols-4 items-center gap-x-3 gap-y-2 p-3 sm:grid-cols-6 lg:grid-cols-8">
        {sponsors.map((s) => (
          <li key={s.id}>
            <Link
              href={s.href}
              className="relative flex h-8 items-center justify-center text-xs font-extrabold uppercase tracking-tight text-neutral-500 grayscale transition hover:text-brand hover:grayscale-0"
            >
              {s.logoUrl ? (
                <Image src={s.logoUrl} alt={s.name} fill sizes="96px" className="object-contain" />
              ) : (
                s.name
              )}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
