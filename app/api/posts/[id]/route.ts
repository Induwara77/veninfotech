import { NextRequest, NextResponse } from 'next/server';
import { updatePost, deletePost } from '@/lib/posts';
import { revalidatePath } from 'next/cache';

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    const body = await request.json();
    const updated = await updatePost(numericId, body);

    revalidatePath('/');
    if (updated.slug) {
      revalidatePath(`/posts/${updated.slug}`);
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to update post';
    console.error('Error updating post:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      return NextResponse.json({ success: false, error: 'Invalid ID' }, { status: 400 });
    }

    await deletePost(numericId);

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to delete post';
    console.error('Error deleting post:', error);
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 },
    );
  }
}
