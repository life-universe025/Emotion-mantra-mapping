# Emotion Mantra Mapping

A beautiful, modern web application that helps users find the perfect mantra for their current emotional state and track their meditation practice.

## Features

- **Emotion-based Mantra Selection**: Choose from 10 core emotions to find the perfect mantra
- **Interactive Practice Session**: Audio playback, repetition counter, and progress tracking
- **Reflection Journaling**: Post-practice reflection and note-taking
- **Streak Tracking**: Daily practice streaks and statistics
- **Beautiful UI**: Modern, responsive design with Devanagari script support

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd emotion-mantra-mapping
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env` and fill in your Supabase credentials:

```bash
cp env.example .env
```

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set up Database

1. In your Supabase dashboard, go to the SQL Editor
2. Run the schema creation script:

```sql
-- Copy and paste the contents of supabase-schema.sql
```

3. Run the seed data script:

```sql
-- Copy and paste the contents of supabase-seed-data.sql
```

### 4. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## Database Schema

### Tables

- **mantras**: Core mantra data with Devanagari script, transliteration, and meanings
- **sessions**: Individual practice sessions with repetition counts and duration
- **user_stats**: User statistics including streaks and total practice time

### Key Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic Streak Calculation**: Triggers update user stats when sessions are created
- **Emotion Mapping**: Each mantra is mapped to specific emotions for easy discovery

## Emotion → Mantra Mapping

The app includes 10 core emotions with their corresponding mantras:

1. **Anxiety/Fear** → Mahamrityunjaya Mantra (healing, protection)
2. **Stress/Mental Fog** → Gayatri Mantra (clarity, inner light)
3. **Anger/Ego** → Om Namah Shivaya (ego surrender, calming)
4. **Grounding/Calm** → So Ham (breath anchoring, centering)
5. **Sadness/Compassion** → Om Mani Padme Hum (compassion, ease)
6. **Confidence/New Start** → Ganesh Mantra (obstacle removal)
7. **Peace/Sleep** → Om Shanti (peace invocation)
8. **Gratitude/Joy** → Lokah Samastah (well-being for all)
9. **Focus/Study** → Saraswati Mantra (wisdom, learning)
10. **Letting Go/Acceptance** → Aham Brahmasmi (non-dual realization)

## Development

### Project Structure

```
src/
├── components/          # React components
│   ├── EmotionSelector.tsx
│   ├── MantraPractice.tsx
│   ├── ReflectionModal.tsx
│   └── Header.tsx
├── data/               # Static data
│   ├── emotions.ts
│   └── mantras.ts
├── lib/                # Utilities
│   └── supabase.ts
├── services/           # API services
│   └── supabase.ts
├── types/              # TypeScript types
│   └── index.ts
└── App.tsx
```

### Key Components

- **EmotionSelector**: Grid of emotion cards with search functionality
- **MantraPractice**: Main practice interface with audio, counter, and timer
- **ReflectionModal**: Post-practice reflection and journaling
- **Header**: Navigation with back button and emotion context

### Audio System

- **Pre-rendered Audio**: Supports MP3 files for authentic pronunciation
- **TTS Fallback**: Browser speech synthesis for accessibility
- **Auto-play**: Audio plays automatically with each count

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app is a standard Vite React app and can be deployed to:
- Netlify
- Railway
- Render
- Any static hosting service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Sanskrit mantras and their meanings are sourced from traditional texts
- Devanagari script support via Noto Sans Devanagari font
- Icons by Lucide React
- Built with modern web technologies for accessibility and performance
