'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PenTool, Gamepad2, BarChart3, Sparkles } from 'lucide-react';
import { UserProfile } from '@/types';

export default function HomePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dailyProgress, setDailyProgress] = useState<any>(null);

  useEffect(() => {
    // Get or create default profile
    const loadProfile = async () => {
      try {
        const response = await fetch('/api/profile?id=1');
        if (response.ok) {
          const data = await response.json();
          setProfile(data);
        } else {
          // Create default profile
          const newProfile = {
            name: 'Student',
            age: 7,
            avatarId: 1,
            difficultyLevel: 'EASY',
            handPreference: 'RIGHT',
            level: 1,
            totalStars: 0
          };
          const createResponse = await fetch('/api/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfile)
          });
          if (createResponse.ok) {
            const data = await createResponse.json();
            setProfile(data);
          }
        }
      } catch (error) {
        console.error('Failed to load profile:', error);
      }
    };

    loadProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      const today = new Date().toISOString().split('T')[0];
      fetch(`/api/progress?userId=${profile.id}&date=${today}`)
        .then(res => res.json())
        .then(data => setDailyProgress(data))
        .catch(console.error);
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">
          Hello, {profile.name}! 👋
        </h1>
        <p className="text-gray-600">Ready to practice writing today?</p>
      </div>

      {/* Daily Progress Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Today's Progress</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {dailyProgress?.activitiesCompleted || 0}
            </div>
            <div className="text-sm text-gray-600">Activities</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-500">
              ⭐ {dailyProgress?.starsEarned || 0}
            </div>
            <div className="text-sm text-gray-600">Stars</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {dailyProgress?.averageAccuracy?.toFixed(0) || 0}%
            </div>
            <div className="text-sm text-gray-600">Accuracy</div>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Daily Goal</span>
            <span className="text-sm font-semibold text-gray-800">
              {dailyProgress?.activitiesCompleted || 0} / 5 activities
            </span>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-purple-600 h-3 rounded-full transition-all"
              style={{
                width: `${Math.min(100, ((dailyProgress?.activitiesCompleted || 0) / 5) * 100)}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link
          href="/practice"
          className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <PenTool size={48} className="mb-3" />
          <h3 className="text-xl font-bold mb-2">Practice Letters</h3>
          <p className="text-purple-100 text-sm">Trace letters and improve your writing</p>
        </Link>

        <Link
          href="/games"
          className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <Gamepad2 size={48} className="mb-3" />
          <h3 className="text-xl font-bold mb-2">Play Games</h3>
          <p className="text-pink-100 text-sm">Learn through fun interactive games</p>
        </Link>
      </div>

      {/* Stats Card */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Your Stats</h2>
          <Sparkles className="text-yellow-500" size={24} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-purple-600">{profile.totalStars}</div>
            <div className="text-sm text-gray-600">Total Stars</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">Level {profile.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
        </div>
      </div>
    </div>
  );
}
