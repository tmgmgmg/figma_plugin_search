import { NextResponse } from 'next/server';
import { fetchPlugins } from '@/lib/kuroco';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '28', 10);
  const search = searchParams.get('search') || undefined;
  const category = searchParams.get('category') || undefined;
  const tag = searchParams.get('tag') || undefined;

  try {
    const { plugins, total } = await fetchPlugins({ page, limit, search, category, tag });
    return NextResponse.json({ plugins, total });
  } catch (error) {
    console.error('Error fetching plugins:', error);
    return NextResponse.json({ error: 'Failed to fetch plugins' }, { status: 500 });
  }
}