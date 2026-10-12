'use client';

import { useRef } from 'react';
import Link from 'next/link';
import Cover from '@/components/ui/Cover';
import type { Game } from '@/lib/types';

export default function LatestGamesGrid({
  title = 'Latest games',
  games,
}: {
  title?: string;
  games: Game[];
}) {
  const track = useRef<HTMLUListElement>(null);

  const scroll = (dir: 1 | -1) => {
    const el = track.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' });
  };

  if (games.length === 0) return null;

  return (
    <section aria-labelledby="latest-games-heading">
      <div className="mb-3 flex items-center justify-between">
        <h2
          id="latest-games-heading"
          className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-600"
        >
          {title}
        </h2>
        <div className="flex gap-1">
          {([-1, 1] as const).map((dir) => (
            <button
              key={dir}
              type="button"
              onClick={() => scroll(dir)}
              aria-label={dir === -1 ? 'Previous games' : 'Next games'}
              className="grid size-6 place-items-center bg-night text-xs text-white transition-colors hover:bg-brand"
            >
              {dir === -1 ? '‹' : '›'}
            </button>
          ))}
        </div>
      </div>

      <ul
        ref={track}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {games.map((game) => (
          <li key={game.id} className="w-36 shrink-0 snap-start bg-night text-white">
            <Link href={game.href} className="group block">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Cover
                  src={game.coverUrl}
                  alt={`${game.title} cover`}
                  seed={game.id}
                  sizes="144px"
                  className="transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/80 to-transparent" />
              </div>
              <div className="p-2">
                <p className="truncate text-[11px] font-bold uppercase tracking-wide">{game.title}</p>
                <p className="text-[10px] text-brand">{game.platform}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
