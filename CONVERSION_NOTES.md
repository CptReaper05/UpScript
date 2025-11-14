# Android to Next.js Conversion Notes

## Overview

This document outlines the conversion of the UpScript Android app to a Next.js web application.

## Key Changes

### Architecture

**Android (Original)**
- Kotlin with MVVM architecture
- Room Database (SQLite)
- Material Design 3
- Navigation Component
- ViewBinding
- ViewModel + LiveData

**Next.js (Converted)**
- TypeScript with React
- better-sqlite3 (SQLite)
- Tailwind CSS
- Next.js App Router
- React Hooks
- Client/Server Components

### Database

- **Location**: `web/data/upscript.db`
- **Schema**: Same 5 tables (user_profiles, activity_progress, daily_progress, badges, custom_words)
- **Operations**: Direct SQL via better-sqlite3 instead of Room DAOs

### UI Components

#### TracingView → TracingCanvas

**Android:**
- Custom View extending View class
- Canvas API for drawing
- Touch event handling
- Path-based letter rendering

**Next.js:**
- React component with HTML5 Canvas
- Mouse/Touch event handling
- SVG path parsing for letter rendering
- Same accuracy algorithm

### Navigation

**Android:**
- Single Activity with Navigation Component
- Bottom Navigation Bar
- Fragment-based screens

**Next.js:**
- App Router with file-based routing
- Custom Layout component with bottom nav
- Page components

### State Management

**Android:**
- ViewModel with LiveData
- Repository pattern
- Coroutines for async operations

**Next.js:**
- React hooks (useState, useEffect)
- API routes for data operations
- Client-side fetching

## Feature Parity

### ✅ Implemented

- Letter tracing with accuracy detection
- Progress tracking
- Badge system
- User profiles
- Settings
- Object Recognition game
- Daily goals
- Star rewards

### 🚧 Partially Implemented

- Games (only Object Recognition fully implemented)
- Letter paths (simplified paths, can be enhanced)

### ❌ Not Yet Implemented

- Text-to-Speech (requires Web Speech API)
- Haptic feedback (not available on web)
- Advanced animations (Lottie not integrated)
- Speech recognition
- Offline mode

## API Routes

All API routes are in `app/api/`:

- `/api/profile` - User profile CRUD
- `/api/progress` - Activity and daily progress
- `/api/badges` - Badge management

## Running the Application

```bash
cd web
npm install
npm run dev
```

Visit http://localhost:3000

## Database Initialization

The database is automatically created on first API call. Schema initialization happens in `lib/db.ts`.

## Future Enhancements

1. **Better Letter Paths**: Implement more accurate SVG paths for all letters
2. **Text-to-Speech**: Use Web Speech API for letter pronunciation
3. **More Games**: Complete implementations for Letter Match, Sound Game, etc.
4. **PWA Support**: Add service worker for offline functionality
5. **Backend API**: Move to separate backend for multi-user support
6. **Real-time Updates**: WebSocket support for live progress updates

## Notes

- The letter path rendering is simplified. For production, consider using a proper SVG path parser or pre-rendered letter templates.
- Canvas coordinates need proper scaling for different screen sizes.
- Database is file-based SQLite. For production, consider PostgreSQL or a cloud database.
- All API routes are server-side rendered. Consider adding client-side caching for better performance.

