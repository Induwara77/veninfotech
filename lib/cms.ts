import type { FeaturedGame, ForumThread, Game, Reviewer, Sponsor } from '@/lib/types';

/*
 * Every function here is async on purpose: replace the body with a CMS / API call
 * (fetch, or a 'use cache' function with cacheLife()) without touching any component.
 */

export async function getLatestGames(): Promise<Game[]> {
  return [
    { id: 'g1', title: 'Crysis 3', platform: 'PC', href: '#' },
    { id: 'g2', title: 'Rise of the Tomb Raider', platform: 'PC / Xbox', href: '#' },
    { id: 'g3', title: 'Halo Infinite', platform: 'Xbox / PC', href: '#' },
    { id: 'g4', title: 'Need for Speed', platform: 'PS4', href: '#' },
    { id: 'g5', title: 'Mass Effect', platform: 'PC / PS4', href: '#' },
    { id: 'g6', title: 'The Witcher 3', platform: 'PC / PS4', href: '#' },
    { id: 'g7', title: 'Titanfall 2', platform: 'PC / Xbox', href: '#' },
    { id: 'g8', title: 'Forza Horizon', platform: 'Xbox', href: '#' },
  ];
}

export async function getSponsors(): Promise<Sponsor[]> {
  return [
    'MSI', 'Razer', 'Logitech', 'Steam', 'Twitch', 'Nvidia', 'AMD', 'Intel',
    'Asus', 'Corsair', 'HyperX', 'SteelSeries', 'Epic', 'Ubisoft', 'EA', 'Sony',
  ].map((name) => ({ id: name.toLowerCase(), name, href: '#' }));
}

export async function getTopReviewers(): Promise<Reviewer[]> {
  return [
    { id: 'r1', name: 'Cindy Rouse', rating: 5, game: 'Overwatch' },
    { id: 'r2', name: 'Carl Humes', rating: 5, game: 'Doom' },
    { id: 'r3', name: 'Susan Blank', rating: 4, game: 'CS:GO' },
    { id: 'r4', name: 'John Smiter', rating: 4, game: 'Dota 2' },
    { id: 'r5', name: 'Mark Thompson', rating: 4, game: 'Quake' },
  ];
}

export async function getFeaturedGame(): Promise<FeaturedGame> {
  return {
    id: 'f1',
    title: 'A Hat in Time',
    tagline: 'A cute-as-heck 3D platformer featuring a little girl who stitches time.',
    href: '#',
  };
}

export async function getForumThreads(): Promise<ForumThread[]> {
  return [
    {
      id: 't1',
      title: 'Problem with my game? Please help!',
      author: 'Rocky',
      excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod.',
      date: '2017-01-31',
      href: '#',
    },
    {
      id: 't2',
      title: 'Best settings for 144Hz gaming?',
      author: 'Ava',
      excerpt: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.',
      date: '2017-01-30',
      href: '#',
    },
    {
      id: 't3',
      title: 'What are you playing this weekend?',
      author: 'Kenji',
      excerpt: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.',
      date: '2017-01-28',
      href: '#',
    },
    {
      id: 't4',
      title: 'Modding guide: getting started',
      author: 'Lena',
      excerpt: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui.',
      date: '2017-01-25',
      href: '#',
    },
  ];
}
