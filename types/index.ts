// Types for UpScript web application

export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

export enum HandPreference {
  LEFT = 'LEFT',
  RIGHT = 'RIGHT'
}

export enum ActivityType {
  LETTER_TRACING = 'LETTER_TRACING',
  WORD_TRACING = 'WORD_TRACING',
  LETTER_MATCH = 'LETTER_MATCH',
  OBJECT_RECOGNITION = 'OBJECT_RECOGNITION',
  SOUND_GAME = 'SOUND_GAME',
  WORD_BUILDER = 'WORD_BUILDER',
  MEMORY_MATCH = 'MEMORY_MATCH'
}

export enum BadgeType {
  FIRST_LETTER_MASTER = 'FIRST_LETTER_MASTER',
  LETTER_CHAMPION = 'LETTER_CHAMPION',
  ALPHABET_MASTER = 'ALPHABET_MASTER',
  WORD_STARTER = 'WORD_STARTER',
  WORD_WIZARD = 'WORD_WIZARD',
  SENTENCE_STAR = 'SENTENCE_STAR',
  DAILY_CHAMPION = 'DAILY_CHAMPION',
  WEEK_WARRIOR = 'WEEK_WARRIOR',
  PERFECT_SCORE = 'PERFECT_SCORE',
  SPEED_DEMON = 'SPEED_DEMON',
  PRACTICE_PRO = 'PRACTICE_PRO',
  VOICE_MASTER = 'VOICE_MASTER'
}

export interface UserProfile {
  id: number;
  name: string;
  age: number;
  avatarId: number;
  difficultyLevel: DifficultyLevel;
  handPreference: HandPreference;
  level: number;
  totalStars: number;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityProgress {
  id: number;
  userId: number;
  activityType: ActivityType;
  itemId: string; // letter, word, etc.
  accuracy: number;
  timeSpent: number; // seconds
  stars: number;
  completed: boolean;
  completedAt: string;
}

export interface DailyProgress {
  id: number;
  userId: number;
  date: string; // YYYY-MM-DD
  activitiesCompleted: number;
  starsEarned: number;
  timeSpent: number; // seconds
  averageAccuracy: number;
  goalMet: boolean;
}

export interface Badge {
  id: number;
  userId: number;
  badgeType: BadgeType;
  earnedAt: string;
  isNew: boolean;
}

export interface CustomWord {
  id: number;
  userId: number;
  word: string;
  category: string;
  difficulty: DifficultyLevel;
  addedBy: string;
  createdAt: string;
}

export interface LetterPath {
  letter: string;
  path: string; // SVG path data
  guidePoints: Array<{ x: number; y: number }>;
}

