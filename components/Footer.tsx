import Link from 'next/link';

const COLUMNS = [
  { title: 'Publication', links: ['Technology', 'Science', 'Economy', 'Culture'] },
  { title: 'Categories', links: ['World', 'Travel', 'AI & Software', 'Reviews'] },
  { title: 'Learn more', links: ['About', 'Editorial Policy', 'Press', 'Contact'] },
];

export default function Footer() {
  return (
    <footer className="bg-night text-neutral-400">
      <div className="mx-auto grid w-full max-w-[1170px] gap-8 border-t border-white/10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        {COLUMNS.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">{col.title}</h2>
            <ul className="mt-4 space-y-2 text-xs">
              {col.links.map((l) => (
                <li key={l}>
                  <Link
                    href={l === 'About' ? '/about' : `/category/${l.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                    className="transition-colors hover:text-brand"
                  >
                    {l}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}

        <div>
          <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-white">
            Subscribe to newsletter
          </h2>
          <form className="mt-4 flex overflow-hidden rounded-full bg-night-2">
            <label htmlFor="newsletter-email" className="sr-only">Email address</label>
            <input
              id="newsletter-email"
              type="email"
              placeholder="Email"
              className="min-w-0 flex-1 bg-transparent px-4 py-2 text-xs text-white placeholder:text-neutral-600 focus:outline-none"
            />
            {/* Not wired up yet: needs a newsletter provider / server action */}
            <button
              type="button"
              disabled
              aria-label="Subscribe (coming soon)"
              className="m-1 grid size-7 place-items-center rounded-full bg-brand text-white disabled:opacity-70"
            >
              →
            </button>
          </form>
        </div>
      </div>

      <p className="border-t border-white/10 py-4 text-center text-[11px] text-neutral-600">
        © VIT. All rights reserved.
      </p>
    </footer>
  );
}
