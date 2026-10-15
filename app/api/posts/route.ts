import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, createPost } from '@/lib/posts';
import { revalidatePath } from 'next/cache';


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status') as 'published' | 'draft' | 'all' | null;
    const filter = statusParam || 'published';

    const posts = await getAllPosts(filter);
    return NextResponse.json({ success: true, posts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch posts';
    console.error('Error fetching posts:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, excerpt, content, category, image, status, author } = body;

    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 },
      );
    }

    if (!content || !content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 },
      );
    }

    const post = await createPost({
      title,
      slug,
      excerpt,
      content,
      category,
      image,
      status: status || 'published',
      author,
    });

    // Revalidate public feeds so updates appear instantly without redeployment
    revalidatePath('/');
    revalidatePath(`/posts/${post.slug}`);

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to create post';
    console.error('Error creating post:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
