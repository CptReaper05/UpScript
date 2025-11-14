import { NextRequest, NextResponse } from 'next/server';
import { badgeDb } from '@/lib/db';
import { Badge, BadgeType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    const badges = badgeDb.getByUser(parseInt(userId));
    return NextResponse.json(badges);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch badges' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const badge = badgeDb.create(body);
    return NextResponse.json(badge, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create badge' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId } = body;
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    badgeDb.markAsRead(parseInt(userId));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update badges' }, { status: 500 });
  }
}

