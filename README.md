# UpScript Web - Dysgraphia Support Website

A Next.js web application converted from the Android app to help children with dysgraphia improve their writing through interactive exercises.

## Features

- ✍️ **Letter Tracing**: Interactive canvas-based letter tracing with accuracy detection
- 🎮 **Learning Games**: Object Recognition and other educational games
- 📊 **Progress Tracking**: Charts and statistics for tracking improvement
- ⭐ **Gamification**: Stars, badges, and daily goals
- 👤 **User Profiles**: Customizable profiles with avatars and preferences
- ⚙️ **Settings**: Sound, music, haptic feedback, and difficulty levels

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (better-sqlite3)
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Navigate to the web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
web/
├── app/                    # Next.js app directory
│   ├── api/                # API routes
│   │   ├── profile/       # User profile endpoints
│   │   ├── progress/      # Progress tracking endpoints
│   │   └── badges/        # Badge endpoints
│   ├── practice/          # Letter practice page
│   ├── games/             # Games page
│   ├── progress/          # Progress dashboard
│   ├── settings/          # Settings page
│   └── page.tsx           # Home page
├── components/             # React components
│   ├── TracingCanvas.tsx  # Letter tracing component
│   └── Layout.tsx         # Main layout with navigation
├── lib/                   # Utilities
│   ├── db.ts             # Database setup and operations
│   └── letters.ts        # Letter paths and accuracy calculation
└── types/                # TypeScript types
    └── index.ts          # Type definitions
```

## Key Features

### Letter Tracing

The tracing component uses HTML5 Canvas to:
- Display guide paths for letters
- Track user drawing strokes
- Calculate accuracy using distance-based algorithm
- Award stars based on performance (1-3 stars)

### Accuracy Algorithm

```
accuracy = (matchRatio * 0.6 + distanceScore * 0.4) * 100
```

- **matchRatio**: Percentage of user points within threshold distance
- **distanceScore**: Quality based on average distance from guide
- **threshold**: Adjustable based on difficulty (Easy: 60px, Medium: 50px, Hard: 40px)

### Database

SQLite database stored in `data/upscript.db` with tables:
- `user_profiles`: User information and preferences
- `activity_progress`: Individual activity completions
- `daily_progress`: Daily aggregated statistics
- `badges`: Earned badges
- `custom_words`: User-added practice words

## Development

### Build for Production

```bash
npm run build
npm start
```

### Database Location

The database file is created at `web/data/upscript.db` on first run.

## Differences from Android App

1. **Canvas vs Custom View**: Uses HTML5 Canvas instead of Android Canvas API
2. **SQLite**: Uses better-sqlite3 instead of Room database
3. **Navigation**: Next.js routing instead of Navigation Component
4. **State Management**: React hooks instead of ViewModel/LiveData
5. **Styling**: Tailwind CSS instead of Material Design XML

## Future Enhancements

- [ ] Add remaining game implementations (Letter Match, Sound Game, etc.)
- [ ] Implement text-to-speech for letter pronunciation
- [ ] Add more letter path variations
- [ ] Implement offline support with service workers
- [ ] Add parent/teacher dashboard
- [ ] Multi-language support
- [ ] Cloud sync with backend API

