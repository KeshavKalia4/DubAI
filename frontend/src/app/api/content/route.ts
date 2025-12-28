import { NextResponse } from 'next/server';
import { ContentItem } from '@/types';
import { uwEvents } from '@/data/uwEvents';

export async function GET() {
    const contentItems: ContentItem[] = uwEvents;
    return NextResponse.json(contentItems);
}
