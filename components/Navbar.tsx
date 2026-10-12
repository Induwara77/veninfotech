import Link from 'next/link';

interface NavItem {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'News', href: '/' },
  { label: 'Media', href: '#' },
  {
    label: 'Reviews',
    href: '#',
    children: [
      { label: 'Top games', href: '#' },
      { label: 'Upcoming', href: '#' },
      { label: 'Trailers', href: '#' },
      { label: 'Interviews', href: '#' },
    ],
  },
  { label: 'Community', href: '#' },
  { label: 'About', href: '#' },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-white">
      <span className="grid size-6 place-items-center rounded-sm bg-brand text-xs">G</span>
      Game Portal
    </Link>
  );
}

export default function Navbar() {
  return (
    <header>
      {/* Thin top strip */}
      <div className="bg-black text-[10px] uppercase tracking-[0.25em] text-neutral-400">
        <div className="mx-auto flex h-7 w-full max-w-[1170px] items-center justify-between px-4">
          <span>Your daily game news</span>
          <div className="flex items-center gap-4">
            <Link href="#" className="hover:text-white">Login</Link>
            <Link href="#" className="hover:text-white">Register</Link>
            <span aria-hidden className="size-3 bg-brand" />
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="bg-night-2">
        <nav
          aria-label="Main"
          className="mx-auto flex h-14 w-full max-w-[1170px] items-center justify-between px-4"
        >
          <Logo />

          {/* Desktop links (CSS-only dropdown) */}
          <ul className="hidden items-center gap-1 md:flex">
            {NAV_ITEMS.map((item) => (
              <li key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className="flex h-14 items-center gap-1 px-3 text-xs font-semibold uppercase tracking-wider text-neutral-300 transition-colors hover:text-white"
                >
                  {item.label}
                  {item.children && <span aria-hidden className="text-[8px]">▼</span>}
                </Link>
                {item.children && (
                  <ul className="invisible absolute left-0 top-full z-30 min-w-44 border-t-2 border-brand bg-night py-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <li key={child.label}>
                        <Link
                          href={child.href}
                          className="block px-4 py-1.5 text-xs text-neutral-300 hover:bg-night-2 hover:text-brand"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 text-xs text-neutral-300 md:flex">
            <button type="button" aria-label="Search" className="hover:text-white">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>
            </button>
            <span className="rounded-sm border border-neutral-600 px-1.5 py-0.5 uppercase">EN</span>
          </div>

          {/* Mobile menu (no JS) */}
          <details className="relative md:hidden">
            <summary className="cursor-pointer list-none px-2 py-1 text-sm text-white" aria-label="Menu">
              ☰
            </summary>
            <ul className="absolute right-0 top-full z-30 mt-3 w-56 bg-night py-2 shadow-xl">
              {NAV_ITEMS.flatMap((item) => [
                item,
                ...(item.children ?? []).map((c) => ({ ...c, label: `– ${c.label}` })),
              ]).map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="block px-4 py-2 text-xs uppercase tracking-wider text-neutral-300 hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        </nav>
      </div>
    </header>
  );
}
