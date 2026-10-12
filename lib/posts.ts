import fs from 'node:fs/promises';
import path from 'node:path';
import { cache } from 'react';
import matter from 'gray-matter';
import { sql } from '@/lib/db';

export interface Post {
  slug: string;
  title: string;
  /** Display label */
  date: string;
  /** For sorting */
  timestamp: number;
  excerpt: string;
  category?: string;
  image?: string;
  views: number;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

function parseDate(raw: unknown): { label: string; timestamp: number } {
  // gray-matter turns unquoted YAML dates into Date objects; quoted ones stay strings
  const d = raw instanceof Date ? raw : new Date(String(raw ?? ''));
  const timestamp = Number.isNaN(d.getTime()) ? 0 : d.getTime();
  const label =
    typeof raw === 'string'
      ? raw
      : timestamp
        ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : '';
  return { label, timestamp };
}

async function getViewCounts(slugs: string[]): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (slugs.length === 0) return counts;
  try {
    // One round trip instead of one query per post
    const rows = await sql`
      SELECT slug, view_count FROM post_views WHERE slug = ANY(${slugs})
    `;
    for (const row of rows) counts.set(row.slug, Number(row.view_count));
  } catch {
    // Table missing or DB unreachable: render with 0 views
  }
  return counts;
}

/** All posts with live view counts. cache() dedupes calls within one render pass. */
export const getAllPosts = cache(async (): Promise<Post[]> => {
  const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'));
  const slugs = files.map((f) => f.replace(/\.md$/, ''));

  const [views, parsed] = await Promise.all([
    getViewCounts(slugs),
    Promise.all(
      files.map(async (file) => {
        const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
        return matter(raw).data;
      }),
    ),
  ]);

  return parsed.map((data, i) => {
    const { label, timestamp } = parseDate(data.date);
    return {
      slug: slugs[i],
      title: String(data.title ?? slugs[i]),
      date: label,
      timestamp,
      excerpt: String(data.excerpt ?? ''),
      category: data.category,
      image: data.image,
      views: views.get(slugs[i]) ?? 0,
    };
  });
});

export const getLatestPosts = cache(async (count: number): Promise<Post[]> => {
  const posts = await getAllPosts();
  return posts.toSorted((a, b) => b.timestamp - a.timestamp).slice(0, count);
});
