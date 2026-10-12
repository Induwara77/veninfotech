export interface Game {
  id: string;
  title: string;
  platform: string;
  coverUrl?: string;
  href: string;
}

export interface Sponsor {
  id: string;
  name: string;
  logoUrl?: string;
  href: string;
}

export interface Reviewer {
  id: string;
  name: string;
  avatarUrl?: string;
  /** 0-5 */
  rating: number;
  game: string;
}

export interface FeaturedGame {
  id: string;
  title: string;
  tagline: string;
  imageUrl?: string;
  href: string;
}

export interface ForumThread {
  id: string;
  title: string;
  author: string;
  excerpt: string;
  /** ISO date string */
  date: string;
  href: string;
}
