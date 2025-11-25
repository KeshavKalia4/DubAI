import { NextResponse } from 'next/server';
import { ContentItem } from '@/types';
import { mockContent } from '@/data/mockData';

export async function GET() {
    const contentItems: ContentItem[] = mockContent;
    return NextResponse.json(contentItems);
}
