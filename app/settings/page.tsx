'use client';

import { useEffect, useState } from 'react';
import { UserProfile, DifficultyLevel, HandPreference } from '@/types';
import { User, Volume2, VolumeX, Vibrate, Settings as SettingsIcon } from 'lucide-react';

const avatars = ['😊', '😎', '🥳', '🤗', '😺', '🐶', '🦄', '🌟'];

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [hapticEnabled, setHapticEnabled] = useState(true);

  useEffect(() => {
    fetch('/api/profile?id=1')
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(console.error);
  }, []);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: profile.id, ...updates })
    });
    
    if (response.ok) {
      const updated = await response.json();
      setProfile(updated);
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-600 mb-6 text-center">
        Settings
      </h1>

      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <User size={24} className="text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">Profile</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => updateProfile({ name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              type="number"
              value={profile.age}
              onChange={(e) => updateProfile({ age: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Avatar
            </label>
            <div className="grid grid-cols-8 gap-2">
              {avatars.map((avatar, index) => (
                <button
                  key={index}
                  onClick={() => updateProfile({ avatarId: index + 1 })}
                  className={`text-4xl p-2 rounded-lg border-2 transition-all ${
                    profile.avatarId === index + 1
                      ? 'border-purple-600 bg-purple-50'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty Level
            </label>
            <select
              value={profile.difficultyLevel}
              onChange={(e) => updateProfile({ difficultyLevel: e.target.value as DifficultyLevel })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hand Preference
            </label>
            <select
              value={profile.handPreference}
              onChange={(e) => updateProfile({ handPreference: e.target.value as HandPreference })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="RIGHT">Right Hand</option>
              <option value="LEFT">Left Hand</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preferences Section */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon size={24} className="text-purple-600" />
          <h2 className="text-xl font-bold text-gray-800">Preferences</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {soundEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              <span className="font-medium text-gray-700">Sound Effects</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                soundEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {musicEnabled ? <Volume2 size={24} /> : <VolumeX size={24} />}
              <span className="font-medium text-gray-700">Background Music</span>
            </div>
            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                musicEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  musicEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Vibrate size={24} />
              <span className="font-medium text-gray-700">Haptic Feedback</span>
            </div>
            <button
              onClick={() => setHapticEnabled(!hapticEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                hapticEnabled ? 'bg-purple-600' : 'bg-gray-300'
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  hapticEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-2xl font-bold text-purple-600">Level {profile.level}</div>
            <div className="text-sm text-gray-600">Current Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">{profile.totalStars}</div>
            <div className="text-sm text-gray-600">Total Stars</div>
          </div>
        </div>
      </div>
    </div>
  );
}

