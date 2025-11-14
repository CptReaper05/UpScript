import { NextRequest, NextResponse } from 'next/server';
import { activityProgressDb, dailyProgressDb } from '@/lib/db';
import { ActivityProgress, DailyProgress } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const type = searchParams.get('type');
    const date = searchParams.get('date');
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }
    
    if (date) {
      const daily = dailyProgressDb.getOrCreate(parseInt(userId), date);
      return NextResponse.json(daily);
    }
    
    const activities = activityProgressDb.getByUser(parseInt(userId));
    return NextResponse.json(activities);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch progress' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const progress = activityProgressDb.create(body);
    
    // Update daily progress
    const today = new Date().toISOString().split('T')[0];
    const daily = dailyProgressDb.getOrCreate(progress.userId, today);
    
    const activities = activityProgressDb.getByUser(progress.userId);
    const todayActivities = activities.filter(a => 
      a.completedAt.startsWith(today)
    );
    
    const totalStars = todayActivities.reduce((sum, a) => sum + a.stars, 0);
    const totalTime = todayActivities.reduce((sum, a) => sum + a.timeSpent, 0);
    const avgAccuracy = todayActivities.length > 0
      ? todayActivities.reduce((sum, a) => sum + a.accuracy, 0) / todayActivities.length
      : 0;
    
    dailyProgressDb.update(progress.userId, today, {
      activitiesCompleted: todayActivities.length,
      starsEarned: totalStars,
      timeSpent: totalTime,
      averageAccuracy: avgAccuracy,
      goalMet: todayActivities.length >= 5
    });
    
    return NextResponse.json(progress, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save progress' }, { status: 500 });
  }
}

