# FitSaga AI ⚡

> **Anime-Themed AI Fitness Training Platform**

Train like your favorite anime characters with AI-powered workout plans, personalized nutrition, and RPG-style progress tracking.

## 🎮 Training Paths

| Theme | Style | UI |
|-------|-------|-----|
| ⚡ Saiyan Mode | High intensity strength | Orange energy aura |
| 🌀 Shinobi Mode | Agility, speed, bodyweight | Dark ninja red |
| 🔮 Hunter Mode | Progressive leveling | Purple leveling |
| 💠 Sorcerer Mode | Balance, flexibility, endurance | Mystic blue |

## ✨ Features

- **6-Day Push/Pull/Legs Split** with real exercise data (sets, reps, rest, muscles, calories)
- **Interactive Workout Tracker** with set completion, rest timers, and hydration reminders
- **AI Nutrition Coach** — personalized meal plans based on body metrics & goals
- **AI Workout Coach** — generate custom workout plans via OpenAI
- **RPG Leveling System** — earn XP, level up from Beginner → Elite Warrior
- **Progress Dashboard** — weekly overview chart, streak tracker, stat cards
- **4 Anime Theme Modes** — each transforms the entire UI with unique colors & effects
- **Profile System** — editable body metrics, training preferences

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4, Custom CSS |
| State | Zustand (persisted) |
| Database | PostgreSQL + Prisma |
| Auth | Clerk (ready) |
| AI | OpenAI API |
| Font | Outfit (via next/font) |

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your DATABASE_URL, CLERK keys, and OPENAI_API_KEY

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📂 Project Structure

```
app/
  page.tsx              # Landing page
  layout.tsx            # Root layout with ThemeProvider
  api/workout/          # AI workout coach API
  api/nutrition/        # AI nutrition coach API
  (dashboard)/
    layout.tsx          # Dashboard layout with Navbar
    dashboard/          # Main dashboard
    workout/            # Interactive workout tracker
    nutrition/          # Diet plans & macros
    progress/           # Progress & streak tracking
    profile/            # User settings & metrics

components/
  ThemeProvider.tsx      # Anime theme context
  Navbar.tsx            # Navigation with theme picker

store/
  userStore.ts          # User profile, level, XP, streak
  workoutStore.ts       # Active workout state

lib/
  exerciseData.ts       # Full exercise dataset (6 days)
  nutritionData.ts      # Nutrition plans for all goals
  prisma.ts             # Prisma client singleton
  utils.ts              # Utility functions

prisma/
  schema.prisma         # Database models
```


