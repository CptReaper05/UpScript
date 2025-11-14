import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { 
  UserProfile, 
  ActivityProgress, 
  DailyProgress, 
  Badge, 
  CustomWord,
  DifficultyLevel,
  HandPreference,
  ActivityType,
  BadgeType
} from '@/types';

const dbPath = path.join(process.cwd(), 'data', 'upscript.db');
const dbDir = path.dirname(dbPath);

// Ensure data directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
export function initDatabase() {
  // User Profiles
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      age INTEGER NOT NULL,
      avatarId INTEGER NOT NULL DEFAULT 1,
      difficultyLevel TEXT NOT NULL DEFAULT 'EASY',
      handPreference TEXT NOT NULL DEFAULT 'RIGHT',
      level INTEGER NOT NULL DEFAULT 1,
      totalStars INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // Activity Progress
  db.exec(`
    CREATE TABLE IF NOT EXISTS activity_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      activityType TEXT NOT NULL,
      itemId TEXT NOT NULL,
      accuracy REAL NOT NULL,
      timeSpent INTEGER NOT NULL,
      stars INTEGER NOT NULL DEFAULT 0,
      completed INTEGER NOT NULL DEFAULT 0,
      completedAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES user_profiles(id) ON DELETE CASCADE
    )
  `);

  // Daily Progress
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      date TEXT NOT NULL,
      activitiesCompleted INTEGER NOT NULL DEFAULT 0,
      starsEarned INTEGER NOT NULL DEFAULT 0,
      timeSpent INTEGER NOT NULL DEFAULT 0,
      averageAccuracy REAL NOT NULL DEFAULT 0,
      goalMet INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (userId) REFERENCES user_profiles(id) ON DELETE CASCADE,
      UNIQUE(userId, date)
    )
  `);

  // Badges
  db.exec(`
    CREATE TABLE IF NOT EXISTS badges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      badgeType TEXT NOT NULL,
      earnedAt TEXT NOT NULL DEFAULT (datetime('now')),
      isNew INTEGER NOT NULL DEFAULT 1,
      FOREIGN KEY (userId) REFERENCES user_profiles(id) ON DELETE CASCADE
    )
  `);

  // Custom Words
  db.exec(`
    CREATE TABLE IF NOT EXISTS custom_words (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      word TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'custom',
      difficulty TEXT NOT NULL DEFAULT 'EASY',
      addedBy TEXT NOT NULL DEFAULT 'parent',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (userId) REFERENCES user_profiles(id) ON DELETE CASCADE
    )
  `);

  // Create indexes
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_progress(userId);
    CREATE INDEX IF NOT EXISTS idx_daily_user_date ON daily_progress(userId, date);
    CREATE INDEX IF NOT EXISTS idx_badge_user ON badges(userId);
  `);
}

// Initialize on import
initDatabase();

// User Profile operations
export const userProfileDb = {
  create: (profile: Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>): UserProfile => {
    const stmt = db.prepare(`
      INSERT INTO user_profiles (name, age, avatarId, difficultyLevel, handPreference, level, totalStars)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      profile.name,
      profile.age,
      profile.avatarId,
      profile.difficultyLevel,
      profile.handPreference,
      profile.level,
      profile.totalStars
    );
    return userProfileDb.getById(result.lastInsertRowid as number)!;
  },

  getById: (id: number): UserProfile | null => {
    const stmt = db.prepare('SELECT * FROM user_profiles WHERE id = ?');
    return stmt.get(id) as UserProfile | null;
  },

  getAll: (): UserProfile[] => {
    const stmt = db.prepare('SELECT * FROM user_profiles ORDER BY createdAt DESC');
    return stmt.all() as UserProfile[];
  },

  update: (id: number, updates: Partial<UserProfile>): UserProfile | null => {
    const fields: string[] = [];
    const values: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && value !== undefined) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });
    
    if (fields.length === 0) return userProfileDb.getById(id);
    
    fields.push('updatedAt = datetime("now")');
    values.push(id);
    
    const stmt = db.prepare(`UPDATE user_profiles SET ${fields.join(', ')} WHERE id = ?`);
    stmt.run(...values);
    return userProfileDb.getById(id);
  },

  delete: (id: number): void => {
    const stmt = db.prepare('DELETE FROM user_profiles WHERE id = ?');
    stmt.run(id);
  }
};

// Activity Progress operations
export const activityProgressDb = {
  create: (progress: Omit<ActivityProgress, 'id' | 'completedAt'>): ActivityProgress => {
    const stmt = db.prepare(`
      INSERT INTO activity_progress (userId, activityType, itemId, accuracy, timeSpent, stars, completed)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      progress.userId,
      progress.activityType,
      progress.itemId,
      progress.accuracy,
      progress.timeSpent,
      progress.stars,
      progress.completed ? 1 : 0
    );
    return activityProgressDb.getById(result.lastInsertRowid as number)!;
  },

  getById: (id: number): ActivityProgress | null => {
    const stmt = db.prepare('SELECT * FROM activity_progress WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return { ...row, completed: row.completed === 1 };
  },

  getByUser: (userId: number): ActivityProgress[] => {
    const stmt = db.prepare('SELECT * FROM activity_progress WHERE userId = ? ORDER BY completedAt DESC');
    const rows = stmt.all(userId) as any[];
    return rows.map(row => ({ ...row, completed: row.completed === 1 }));
  },

  getByUserAndType: (userId: number, activityType: ActivityType, itemId: string): ActivityProgress | null => {
    const stmt = db.prepare(`
      SELECT * FROM activity_progress 
      WHERE userId = ? AND activityType = ? AND itemId = ?
      ORDER BY completedAt DESC
      LIMIT 1
    `);
    const row = stmt.get(userId, activityType, itemId) as any;
    if (!row) return null;
    return { ...row, completed: row.completed === 1 };
  }
};

// Daily Progress operations
export const dailyProgressDb = {
  getOrCreate: (userId: number, date: string): DailyProgress => {
    const stmt = db.prepare('SELECT * FROM daily_progress WHERE userId = ? AND date = ?');
    let daily = stmt.get(userId, date) as DailyProgress | null;
    
    if (!daily) {
      const insertStmt = db.prepare(`
        INSERT INTO daily_progress (userId, date, activitiesCompleted, starsEarned, timeSpent, averageAccuracy, goalMet)
        VALUES (?, ?, 0, 0, 0, 0, 0)
      `);
      insertStmt.run(userId, date);
      daily = dailyProgressDb.getOrCreate(userId, date);
    }
    
    return { ...daily, goalMet: (daily as any).goalMet === 1 };
  },

  update: (userId: number, date: string, updates: Partial<DailyProgress>): DailyProgress => {
    const fields: string[] = [];
    const values: any[] = [];
    
    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'userId' && key !== 'date' && value !== undefined) {
        if (key === 'goalMet') {
          fields.push(`${key} = ?`);
          values.push(value ? 1 : 0);
        } else {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }
    });
    
    if (fields.length === 0) return dailyProgressDb.getOrCreate(userId, date);
    
    values.push(userId, date);
    const stmt = db.prepare(`UPDATE daily_progress SET ${fields.join(', ')} WHERE userId = ? AND date = ?`);
    stmt.run(...values);
    
    const result = dailyProgressDb.getOrCreate(userId, date);
    return { ...result, goalMet: (result as any).goalMet === 1 };
  },

  getByUser: (userId: number, limit: number = 30): DailyProgress[] => {
    const stmt = db.prepare(`
      SELECT * FROM daily_progress 
      WHERE userId = ? 
      ORDER BY date DESC 
      LIMIT ?
    `);
    const rows = stmt.all(userId, limit) as any[];
    return rows.map(row => ({ ...row, goalMet: row.goalMet === 1 }));
  }
};

// Badge operations
export const badgeDb = {
  create: (badge: Omit<Badge, 'id' | 'earnedAt'>): Badge => {
    const stmt = db.prepare(`
      INSERT INTO badges (userId, badgeType, isNew)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(badge.userId, badge.badgeType, badge.isNew ? 1 : 0);
    return badgeDb.getById(result.lastInsertRowid as number)!;
  },

  getById: (id: number): Badge | null => {
    const stmt = db.prepare('SELECT * FROM badges WHERE id = ?');
    const row = stmt.get(id) as any;
    if (!row) return null;
    return { ...row, isNew: row.isNew === 1 };
  },

  getByUser: (userId: number): Badge[] => {
    const stmt = db.prepare('SELECT * FROM badges WHERE userId = ? ORDER BY earnedAt DESC');
    const rows = stmt.all(userId) as any[];
    return rows.map(row => ({ ...row, isNew: row.isNew === 1 }));
  },

  hasBadge: (userId: number, badgeType: BadgeType): boolean => {
    const stmt = db.prepare('SELECT COUNT(*) as count FROM badges WHERE userId = ? AND badgeType = ?');
    const result = stmt.get(userId, badgeType) as { count: number };
    return result.count > 0;
  },

  markAsRead: (userId: number): void => {
    const stmt = db.prepare('UPDATE badges SET isNew = 0 WHERE userId = ? AND isNew = 1');
    stmt.run(userId);
  }
};

// Custom Word operations
export const customWordDb = {
  create: (word: Omit<CustomWord, 'id' | 'createdAt'>): CustomWord => {
    const stmt = db.prepare(`
      INSERT INTO custom_words (userId, word, category, difficulty, addedBy)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(word.userId, word.word, word.category, word.difficulty, word.addedBy);
    return customWordDb.getById(result.lastInsertRowid as number)!;
  },

  getById: (id: number): CustomWord | null => {
    const stmt = db.prepare('SELECT * FROM custom_words WHERE id = ?');
    return stmt.get(id) as CustomWord | null;
  },

  getByUser: (userId: number): CustomWord[] => {
    const stmt = db.prepare('SELECT * FROM custom_words WHERE userId = ? ORDER BY createdAt DESC');
    return stmt.all(userId) as CustomWord[];
  },

  delete: (id: number): void => {
    const stmt = db.prepare('DELETE FROM custom_words WHERE id = ?');
    stmt.run(id);
  }
};

export default db;

