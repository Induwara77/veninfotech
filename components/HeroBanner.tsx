import { getLatestPosts } from '@/lib/posts';
import HeroBannerClient, { HeroItem } from './HeroBannerClient';

const DEFAULT_HERO_ITEMS: HeroItem[] = [
  {
    id: 'hero-1',
    badge: 'HOT NOW',
    category: 'WORLD NEWS',
    date: 'NOV 17, 2023',
    title: 'Bulvinar Neque Laoreet Suspendisse Interdum',
    excerpt:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Egestas dui id ornare arcuid ac.',
    image: '/images/hero/hero-bg.jpg',
    href: '#',
  },
  {
    id: 'hero-2',
    badge: 'HOT NOW',
    category: 'CRYPTO',
    date: '2 HOURS AGO',
    title: 'Scelerisque Varius Morbi Enim Nunc Faucibus',
    excerpt:
      'Decentralized finance protocols reach new milestones as institutional capital surges into digital assets across global markets.',
    image: '/images/hero/trending-bitcoin.jpg',
    href: '#',
  },
  {
    id: 'hero-3',
    badge: 'HOT NOW',
    category: 'NATURE',
    date: '4 HOURS AGO',
    title: 'Bulvinar Neque Laoreet Suspendisse Interdum',
    excerpt:
      'Deep ocean expeditions uncover rare marine ecosystems and uncharted geothermal wonders previously unseen.',
    image: '/images/hero/trending-ocean.jpg',
    href: '#',
  },
  {
    id: 'hero-4',
    badge: 'HOT NOW',
    category: 'TRAVEL',
    date: '6 HOURS AGO',
    title: 'Accumsan Tortor Posuere Acut Consequat Semper',
    excerpt:
      'High-altitude trails and pristine wilderness paths draw explorers seeking remote backcountry adventures across alpine passes.',
    image: '/images/hero/trending-hikers.jpg',
    href: '#',
  },
  {
    id: 'hero-5',
    badge: 'HOT NOW',
    category: 'TECH',
    date: '8 HOURS AGO',
    title: 'Augue Neque Gravida Fermentum Sollicitudin',
    excerpt:
      'Smart cities integrate autonomous transit networks and quantum sensor arrays to transform urban living and mobility.',
    image: '/images/hero/breaking-city.jpg',
    href: '#',
  },
];

export default async function HeroBanner() {
  const posts = await getLatestPosts(5);

  if (posts && posts.length > 0) {
    const items: HeroItem[] = posts.map((post, index) => ({
      id: String(post.id ?? post.slug ?? `post-${index}`),
      badge: 'LATEST BLOG',
      category: (post.category || 'BLOG').toUpperCase(),
      date: post.date,
      title: post.title,
      excerpt: post.excerpt,
      image: post.image || '/images/hero/hero-bg.jpg',
      href: `/posts/${post.slug}`,
    }));

    // If there are fewer than 5 posts, pad with default items so carousel has full depth
    if (items.length < 5) {
      const remaining = DEFAULT_HERO_ITEMS.slice(items.length);
      return <HeroBannerClient items={[...items, ...remaining]} />;
    }

    return <HeroBannerClient items={items} />;
  }

  // Graceful fallback to curated showcase
  return <HeroBannerClient items={DEFAULT_HERO_ITEMS} />;
}
