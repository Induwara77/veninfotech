import { cache } from 'react';
import { sql } from '@/lib/db';
import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export interface Post {
  id?: number;
  slug: string;
  title: string;
  date: string;
  timestamp: number;
  excerpt: string;
  content?: string;
  category: string;
  image: string;
  status: 'draft' | 'published';
  author: string;
  views: number;
}

const CONTENT_DIR = path.join(process.cwd(), 'content');

function formatTimestamp(d: Date | string | number): { label: string; timestamp: number } {
  const dateObj = d instanceof Date ? d : new Date(d);
  const timestamp = Number.isNaN(dateObj.getTime()) ? Date.now() : dateObj.getTime();
  const label = dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  return { label, timestamp };
}

/**
 * Fetch all posts with option to filter by status.
 * Public views (homepage, hero, news list) use 'published'.
 * Admin studio uses 'all' or 'draft'.
 */
export const getAllPosts = cache(
  async (statusFilter: 'published' | 'draft' | 'all' = 'published'): Promise<Post[]> => {
    try {
      let query;
      if (statusFilter === 'all') {
        query = sql`
          SELECT 
            p.id,
            p.slug,
            p.title,
            p.excerpt,
            p.content,
            p.category,
            p.image,
            p.status,
            p.author,
            p.created_at,
            COALESCE(v.view_count, p.views, 0) AS views
          FROM posts p
          LEFT JOIN post_views v ON p.slug = v.slug
          ORDER BY p.created_at DESC
        `;
      } else {
        query = sql`
          SELECT 
            p.id,
            p.slug,
            p.title,
            p.excerpt,
            p.content,
            p.category,
            p.image,
            p.status,
            p.author,
            p.created_at,
            COALESCE(v.view_count, p.views, 0) AS views
          FROM posts p
          LEFT JOIN post_views v ON p.slug = v.slug
          WHERE p.status = ${statusFilter}
          ORDER BY p.created_at DESC
        `;
      }

      const rows = await query;

      if (rows && rows.length > 0) {
        interface DbPostRow {
          id: number;
          slug: string;
          title: string;
          excerpt: string | null;
          content: string | null;
          category: string | null;
          image: string | null;
          status: string | null;
          author: string | null;
          created_at: string | Date;
          views: number | string | null;
        }

        const dbPosts = (rows as unknown as DbPostRow[]).map((r) => {
          const { label, timestamp } = formatTimestamp(r.created_at);
          return {
            id: r.id,
            slug: r.slug,
            title: r.title,
            date: label,
            timestamp,
            excerpt: r.excerpt || '',
            content: r.content || '',
            category: r.category || 'TECH',
            image: r.image || '/images/hero/hero-bg.jpg',
            status: (r.status as 'draft' | 'published') || 'published',
            author: r.author || 'Editorial Team',
            views: Number(r.views || 0),
          };
        });

        // Also check if any markdown files exist on disk that are not yet in the DB
        try {
          const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'));
          const existingSlugs = new Set(dbPosts.map((p) => p.slug));
          const missingFiles = files.filter((f) => !existingSlugs.has(f.replace(/\.md$/, '')));

          if (missingFiles.length > 0) {
            const extraPosts = await Promise.all(
              missingFiles.map(async (file) => {
                const slug = file.replace(/\.md$/, '');
                const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
                const { data, content } = matter(raw);
                const { label, timestamp } = formatTimestamp(data.date || new Date());
                return {
                  slug,
                  title: String(data.title || slug),
                  date: label,
                  timestamp,
                  excerpt: String(data.excerpt || ''),
                  content,
                  category: String(data.category || 'TECH'),
                  image: String(data.image || '/images/hero/hero-bg.jpg'),
                  status: (data.status as 'draft' | 'published') || 'published',
                  author: String(data.author || 'Editorial Team'),
                  views: 0,
                };
              }),
            );
            const filteredExtra =
              statusFilter === 'all'
                ? extraPosts
                : extraPosts.filter((p) => p.status === statusFilter);
            return [...dbPosts, ...filteredExtra].toSorted((a, b) => b.timestamp - a.timestamp);
          }
        } catch {
          // If reading content directory fails, simply return dbPosts
        }

        return dbPosts;
      }
    } catch (err) {
      console.warn('Neon DB posts query failed, falling back to local files if any:', err);
    }

    // Fallback: Read local markdown files if DB is unreachable or empty
    try {
      const files = (await fs.readdir(CONTENT_DIR)).filter((f) => f.endsWith('.md'));
      const parsedPosts = await Promise.all(
        files.map(async (file) => {
          const slug = file.replace(/\.md$/, '');
          const raw = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
          const { data, content } = matter(raw);
          const { label, timestamp } = formatTimestamp(data.date || new Date());
          return {
            slug,
            title: String(data.title || slug),
            date: label,
            timestamp,
            excerpt: String(data.excerpt || ''),
            content,
            category: String(data.category || 'TECH'),
            image: String(data.image || '/images/hero/hero-bg.jpg'),
            status: (data.status as 'draft' | 'published') || 'published',
            author: String(data.author || 'Editorial Team'),
            views: 0,
          };
        }),
      );
      const filtered =
        statusFilter === 'all'
          ? parsedPosts
          : parsedPosts.filter((p) => p.status === statusFilter);
      return filtered.toSorted((a, b) => b.timestamp - a.timestamp);
    } catch {
      return [];
    }
  },
);

/**
 * Fetch latest published posts for Hero banner and homepage feeds.
 */
export const getLatestPosts = cache(async (count: number = 5): Promise<Post[]> => {
  const posts = await getAllPosts('published');
  return posts.slice(0, count);
});

/**
 * Fetch published posts matching a specific category slug (e.g. 'technology', 'science', 'economy').
 */
export const getPostsByCategory = cache(async (categorySlug: string): Promise<Post[]> => {
  const posts = await getAllPosts('published');
  const target = categorySlug.toLowerCase().trim();
  return posts.filter((p) => {
    const cat = (p.category || '').toLowerCase().trim();
    const slugified = cat.replace(/[^a-z0-9]+/g, '-');
    return (
      cat === target ||
      slugified === target ||
      (target === 'technology' && (cat === 'tech' || cat === 'technology')) ||
      (target === 'tech' && (cat === 'tech' || cat === 'technology')) ||
      (target === 'world' && (cat === 'world news' || cat === 'world'))
    );
  });
});

/**
 * Fetch a single post by slug (prioritizing database).
 */
export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  try {
    const rows = await sql`
      SELECT 
        p.id,
        p.slug,
        p.title,
        p.excerpt,
        p.content,
        p.category,
        p.image,
        p.status,
        p.author,
        p.created_at,
        COALESCE(v.view_count, p.views, 0) AS views
      FROM posts p
      LEFT JOIN post_views v ON p.slug = v.slug
      WHERE p.slug = ${slug}
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      const r = rows[0];
      const { label, timestamp } = formatTimestamp(r.created_at);
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        date: label,
        timestamp,
        excerpt: r.excerpt || '',
        content: r.content || '',
        category: r.category || 'TECH',
        image: r.image || '/images/hero/hero-bg.jpg',
        status: (r.status as 'draft' | 'published') || 'published',
        author: r.author || 'Editorial Team',
        views: Number(r.views || 0),
      };
    }
  } catch (err) {
    console.warn('Neon DB getPostBySlug query failed, checking filesystem:', err);
  }

  // Fallback: check content directory
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.md`);
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(raw);
    const { label, timestamp } = formatTimestamp(data.date || new Date());
    return {
      slug,
      title: String(data.title || slug),
      date: label,
      timestamp,
      excerpt: String(data.excerpt || ''),
      content,
      category: String(data.category || 'BLOG'),
      image: String(data.image || '/images/hero/hero-bg.jpg'),
      status: 'published',
      author: String(data.author || 'Editorial Team'),
      views: 0,
    };
  } catch {
    return null;
  }
});

/**
 * Create a new post in Neon database.
 */
export async function createPost(post: {
  title: string;
  slug?: string;
  excerpt?: string;
  content: string;
  category?: string;
  image?: string;
  status?: 'draft' | 'published';
  author?: string;
}): Promise<Post> {
  const slug =
    post.slug?.trim() ||
    post.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') ||
    `post-${Date.now()}`;

  const category = (post.category || 'TECH').toUpperCase();
  const status = post.status || 'published';
  const author = post.author?.trim() || 'Editorial Team';
  const image = post.image?.trim() || '/images/hero/hero-bg.jpg';
  const excerpt = post.excerpt?.trim() || '';
  const content = post.content || '';

  const rows = await sql`
    INSERT INTO posts (slug, title, excerpt, content, category, image, status, author)
    VALUES (${slug}, ${post.title}, ${excerpt}, ${content}, ${category}, ${image}, ${status}, ${author})
    RETURNING id, slug, title, excerpt, content, category, image, status, author, created_at
  `;

  const r = rows[0];
  const { label, timestamp } = formatTimestamp(r.created_at);

  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    date: label,
    timestamp,
    excerpt: r.excerpt,
    content: r.content,
    category: r.category,
    image: r.image,
    status: r.status,
    author: r.author,
    views: 0,
  };
}

/**
 * Update an existing post.
 */
export async function updatePost(
  id: number,
  post: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    category?: string;
    image?: string;
    status?: 'draft' | 'published';
    author?: string;
  },
): Promise<Post> {
  const rows = await sql`
    UPDATE posts
    SET 
      title = COALESCE(${post.title}, title),
      slug = COALESCE(${post.slug}, slug),
      excerpt = COALESCE(${post.excerpt}, excerpt),
      content = COALESCE(${post.content}, content),
      category = COALESCE(${post.category?.toUpperCase()}, category),
      image = COALESCE(${post.image}, image),
      status = COALESCE(${post.status}, status),
      author = COALESCE(${post.author}, author),
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING id, slug, title, excerpt, content, category, image, status, author, created_at
  `;

  if (!rows || rows.length === 0) {
    throw new Error(`Post with id ${id} not found.`);
  }

  const r = rows[0];
  const { label, timestamp } = formatTimestamp(r.created_at);

  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    date: label,
    timestamp,
    excerpt: r.excerpt,
    content: r.content,
    category: r.category,
    image: r.image,
    status: r.status,
    author: r.author,
    views: 0,
  };
}

/**
 * Delete a post by id.
 */
export async function deletePost(id: number): Promise<void> {
  await sql`DELETE FROM posts WHERE id = ${id}`;
}
