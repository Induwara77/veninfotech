import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export default function Home() {
  // Read all files from the content directory
  const files = fs.readdirSync(path.join(process.cwd(), 'content'));

  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(
      path.join(process.cwd(), 'content', filename),
      'utf-8'
    );
    const { data } = matter(markdownWithMeta);

    return {
      slug,
      title: data.title,
      date: data.date,
      excerpt: data.excerpt,
    };
  });

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto py-12">
        <header className="mb-12 border-b border-zinc-800 pb-6">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Developer Blog</h1>
          <p className="text-zinc-400">Engineering insights and building in public.</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-xl font-semibold text-zinc-200 mb-4">Latest Posts</h2>
          {posts.map((post) => (
            <article 
              key={post.slug} 
              className="border border-zinc-800 rounded-xl p-6 bg-zinc-900/40 hover:border-zinc-700 transition"
            >
              <span className="text-xs text-zinc-500 font-mono">{post.date}</span>
              <h3 className="text-2xl font-bold mt-1 mb-2">
                <Link href={`/posts/${post.slug}`} className="hover:text-sky-400 transition">
                  {post.title}
                </Link>
              </h3>
              <p className="text-zinc-400 mb-4">{post.excerpt}</p>
              <Link 
                href={`/posts/${post.slug}`} 
                className="text-sm font-medium text-sky-400 hover:underline inline-flex items-center"
              >
                Read article &rarr;
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}