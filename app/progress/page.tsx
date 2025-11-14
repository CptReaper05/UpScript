'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ActivityProgress, Badge, BadgeType } from '@/types';
import { Trophy, Star, Target } from 'lucide-react';

const badgeNames: Record<BadgeType, string> = {
  FIRST_LETTER_MASTER: 'First Letter Master ✏️',
  LETTER_CHAMPION: 'Letter Champion ⭐',
  ALPHABET_MASTER: 'Alphabet Master 🏆',
  WORD_STARTER: 'Word Starter 📝',
  WORD_WIZARD: 'Word Wizard ✨',
  SENTENCE_STAR: 'Sentence Star 📖',
  DAILY_CHAMPION: 'Daily Champion 🔥',
  WEEK_WARRIOR: 'Week Warrior 💪',
  PERFECT_SCORE: 'Perfect Score 💯',
  SPEED_DEMON: 'Speed Demon ⚡',
  PRACTICE_PRO: 'Practice Pro 🎓',
  VOICE_MASTER: 'Voice Master 🎤'
};

export default function ProgressPage() {
  const [activities, setActivities] = useState<ActivityProgress[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [dailyProgress, setDailyProgress] = useState<any[]>([]);

  useEffect(() => {
    // Load progress data
    fetch('/api/progress?userId=1')
      .then(res => res.json())
      .then(data => setActivities(data))
      .catch(console.error);

    fetch('/api/badges?userId=1')
      .then(res => res.json())
      .then(data => setBadges(data))
      .catch(console.error);

    // Load daily progress for chart
    fetch('/api/progress?userId=1')
      .then(res => res.json())
      .then(data => {
        // Group by date
        const grouped = data.reduce((acc: any, activity: ActivityProgress) => {
          const date = activity.completedAt.split('T')[0];
          if (!acc[date]) {
            acc[date] = { date, activities: 0, stars: 0, accuracy: [] };
          }
          acc[date].activities++;
          acc[date].stars += activity.stars;
          acc[date].accuracy.push(activity.accuracy);
          return acc;
        }, {});

        const daily = Object.values(grouped).map((day: any) => ({
          date: day.date,
          activities: day.activities,
          stars: day.stars,
          accuracy: day.accuracy.reduce((a: number, b: number) => a + b, 0) / day.accuracy.length
        }));

        setDailyProgress(daily.slice(-7)); // Last 7 days
      })
      .catch(console.error);
  }, []);

  const totalStars = activities.reduce((sum, a) => sum + a.stars, 0);
  const avgAccuracy = activities.length > 0
    ? activities.reduce((sum, a) => sum + a.accuracy, 0) / activities.length
    : 0;
  const totalActivities = activities.length;

  const allBadges: BadgeType[] = [
    BadgeType.FIRST_LETTER_MASTER, BadgeType.LETTER_CHAMPION, BadgeType.ALPHABET_MASTER,
    BadgeType.WORD_STARTER, BadgeType.WORD_WIZARD, BadgeType.SENTENCE_STAR,
    BadgeType.DAILY_CHAMPION, BadgeType.WEEK_WARRIOR, BadgeType.PERFECT_SCORE,
    BadgeType.SPEED_DEMON, BadgeType.PRACTICE_PRO, BadgeType.VOICE_MASTER
  ];

  const earnedBadgeTypes = new Set(badges.map(b => b.badgeType));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Your Progress
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Star className="text-yellow-500 mx-auto mb-2" size={32} />
          <div className="text-3xl font-bold text-purple-600">{totalStars}</div>
          <div className="text-sm text-gray-600">Total Stars</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Target className="text-green-500 mx-auto mb-2" size={32} />
          <div className="text-3xl font-bold text-purple-600">{avgAccuracy.toFixed(0)}%</div>
          <div className="text-sm text-gray-600">Avg Accuracy</div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <Trophy className="text-blue-500 mx-auto mb-2" size={32} />
          <div className="text-3xl font-bold text-purple-600">{totalActivities}</div>
          <div className="text-sm text-gray-600">Activities</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Activities</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={dailyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="activities" fill="#6C63FF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Accuracy Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={dailyProgress}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Badges */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Badges</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {allBadges.map((badgeType) => {
            const earned = earnedBadgeTypes.has(badgeType);
            return (
              <div
                key={badgeType}
                className={`p-4 rounded-lg border-2 ${
                  earned
                    ? 'border-yellow-400 bg-yellow-50'
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className={`text-2xl mb-2 ${earned ? '' : 'grayscale opacity-50'}`}>
                  {badgeNames[badgeType].split(' ').pop()}
                </div>
                <div className={`text-sm font-semibold ${earned ? 'text-gray-800' : 'text-gray-400'}`}>
                  {badgeNames[badgeType].split(' ').slice(0, -1).join(' ')}
                </div>
                {earned && (
                  <div className="text-xs text-green-600 mt-1">✓ Earned</div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

