import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const instant = false; // Fixes Next.js 16 instant routing warning for params

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'content'));
  return files.map((filename) => ({
    slug: filename.replace('.md', ''),
  }));
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const filePath = path.join(process.cwd(), 'content', `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);
  const htmlContent = await marked(content);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
      <div className="max-w-2xl mx-auto py-12">
        <Link href="/" className="text-sm text-sky-400 hover:underline mb-8 inline-block">
          &larr; Back to home
        </Link>
        <article>
          <header className="mb-8 border-b border-zinc-800 pb-6">
            <span className="text-xs text-zinc-500 font-mono">{data.date}</span>
            <h1 className="text-3xl font-extrabold tracking-tight mt-1 mb-2">{data.title}</h1>
            <p className="text-zinc-400">{data.excerpt}</p>
          </header>
          <div 
            className="prose prose-invert max-w-none text-zinc-300 space-y-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </article>
      </div>
    </main>
  );
}