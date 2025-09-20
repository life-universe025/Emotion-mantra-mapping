# Sanatan Mantra Sadhana

A beautiful, modern web application that helps users find the perfect mantra for their current emotional state and track their meditation practice. Experience the eternal wisdom of sacred mantras combined with cutting-edge technology for your spiritual journey.

## ✨ Features

### 🧘‍♀️ **Core Meditation Experience**
- **Emotion-Based Mantra Selection**: Choose from 10 core emotions to find the perfect mantra
- **Interactive Practice Session**: Audio playback, repetition counter, and progress tracking
- **Guided Breathing Exercises**: 4 different breathing patterns (4-7-8, Box Breathing, Simple Deep, Energizing)
- **Reflection Journaling**: Post-practice reflection and note-taking
- **Multilingual Support**: English and Hindi with seamless language switching

### 📊 **Advanced Analytics & Tracking**
- **Streak Tracking**: Daily practice streaks with celebration animations
- **Comprehensive Statistics**: Total sessions, repetitions, duration, and weekly progress
- **Practice Trends**: Interactive charts showing daily/weekly progress over time
- **Favorite Mantras**: Track your most practiced mantras with quick access
- **Milestone System**: Achievements and badges for consistent practice
- **Goal Setting**: Customizable daily and weekly meditation goals

### 🎨 **Beautiful User Experience**
- **Modern UI**: Responsive design with glassmorphism effects and smooth animations
- **Dark/Light Themes**: Seamless theme switching with system preference detection
- **Streak Celebrations**: Animated celebrations for milestone achievements
- **Devanagari Script Support**: Authentic Sanskrit display with proper fonts
- **Accessibility**: Screen reader support and keyboard navigation

### 🔐 **Secure & Private**
- **Supabase Authentication**: Email magic links and Google OAuth
- **Row Level Security**: Your data is private and secure
- **Edge Functions**: Serverless analytics processing
- **Real-time Updates**: Live data synchronization

## 🛠️ Tech Stack

### **Frontend**
- **React 18** + **TypeScript** + **Vite** - Modern development experience
- **Tailwind CSS** - Utility-first styling with custom animations
- **React Router** - Client-side routing
- **React i18next** - Internationalization (English/Hindi)
- **Recharts** - Beautiful data visualization
- **Lucide React** + **React Icons** - Comprehensive icon library

### **Backend & Database**
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **Edge Functions** - Serverless functions for analytics
- **Row Level Security (RLS)** - Data privacy and security
- **Real-time subscriptions** - Live data updates

### **Audio & Media**
- **Pre-rendered Audio** - Authentic mantra pronunciation
- **Text-to-Speech Fallback** - Browser speech synthesis
- **Audio Controls** - Play/pause with visual feedback

## 🚀 Quick Start

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

### 4. Deploy Edge Functions

```bash
# Deploy all edge functions
./deploy-edge-functions.sh

# Or deploy individual functions
./deploy-profile-analytics.sh
```

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see your app!

## 📊 Database Schema

### **Tables**

- **mantras**: Core mantra data with Devanagari script, transliteration, and meanings
- **sessions**: Individual practice sessions with repetition counts and duration
- **user_stats**: User statistics including streaks and total practice time
- **breathing_sessions**: Breathing exercise data and patterns

### **Key Features**

- **Row Level Security (RLS)**: Users can only access their own data
- **Automatic Streak Calculation**: Triggers update user stats when sessions are created
- **Emotion Mapping**: Each mantra is mapped to specific emotions for easy discovery
- **Analytics Functions**: Edge functions for advanced user analytics

## 🧘‍♀️ Emotion → Mantra Mapping

The app includes 10 traditional Sanskrit mantras with their emotional correspondences:

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

## 🎯 New Features & Components

### **Breathing Guide**
- **4 Breathing Patterns**: 4-7-8 Relaxing, Box Breathing, Simple Deep, Energizing
- **Visual Guidance**: Animated breathing circle with phase indicators
- **Session Tracking**: Records breathing sessions with duration and cycles
- **Integration**: Seamlessly integrated with mantra practice

### **Advanced Analytics**
- **Practice Trends**: Interactive charts showing progress over time
- **Milestone System**: Achievements for consistent practice
- **Goal Tracking**: Daily and weekly meditation goals
- **Insights**: Personalized recommendations based on practice patterns

### **Streak Animations**
- **Celebration Effects**: Animated celebrations for milestone achievements
- **Particle Effects**: Beautiful visual feedback for streak milestones
- **Milestone Recognition**: Special animations for 7, 21, 30, 50, and 100-day streaks

### **Enhanced User Experience**
- **Multilingual Support**: Full English and Hindi localization
- **Theme System**: Dark/light mode with smooth transitions
- **Responsive Design**: Optimized for all device sizes
- **Accessibility**: Screen reader support and keyboard navigation

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── Auth.tsx
│   ├── BreathingGuide.tsx
│   ├── EmotionSelector.tsx
│   ├── LandingPage.tsx
│   ├── MantraPractice.tsx
│   ├── PracticeChart.tsx
│   ├── ProfileCustomization.tsx
│   ├── ReflectionModal.tsx
│   ├── StreakAnimation.tsx
│   ├── UserStats.tsx
│   └── UserProfile.tsx
├── contexts/           # React contexts
│   ├── ProfileCustomizationContext.tsx
│   └── ThemeContext.tsx
├── data/               # Static data
│   ├── emotions.ts
│   └── mantras.ts
├── i18n/               # Internationalization
│   ├── index.ts
│   └── locales/
│       ├── en.json
│       └── hi.json
├── lib/                # Utilities
│   └── supabase.ts
├── pages/              # Page components
│   └── UserProfilePage.tsx
├── services/           # API services
│   ├── edgeFunctions.ts
│   └── supabase.ts
├── types/              # TypeScript types
│   └── index.ts
└── App.tsx
```

## 🔧 Edge Functions

### **Profile Analytics** (`/supabase/functions/profile-analytics/`)
- **User Analytics**: Comprehensive user statistics and insights
- **Milestone Calculation**: Automatic achievement detection
- **Goal Progress**: Daily and weekly goal tracking
- **Challenge System**: Gamified practice challenges

### **User Stats** (`/supabase/functions/user-stats/`)
- **Statistics Aggregation**: Real-time stats calculation
- **Streak Management**: Automatic streak updates
- **Performance Metrics**: Session and repetition tracking

## 🎨 Styling & Theming

### **Design System**
- **Color Palette**: Warm amber/orange theme with spiritual aesthetics
- **Typography**: Traditional fonts with Devanagari script support
- **Animations**: Smooth transitions and micro-interactions
- **Glassmorphism**: Modern glass-like UI elements

### **Responsive Design**
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: Enhanced tablet experience
- **Desktop**: Full-featured desktop interface

## 🚀 Deployment

### **Vercel (Recommended)**

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

### **Other Platforms**

The app is a standard Vite React app and can be deployed to:
- **Netlify**
- **Railway**
- **Render**
- **Any static hosting service**

### **Edge Functions Deployment**

```bash
# Deploy all functions
./deploy-edge-functions.sh

# Deploy specific function
./deploy-profile-analytics.sh
```

## 🔒 Security & Privacy

- **Row Level Security**: Database-level access control
- **Authentication**: Secure Supabase auth with magic links
- **Data Privacy**: Users can only access their own data
- **HTTPS**: All communications encrypted
- **No Data Collection**: No third-party analytics or tracking

## 🌍 Internationalization

### **Supported Languages**
- **English** (en) - Default
- **Hindi** (hi) - Full translation

### **Translation Coverage**
- All UI text and labels
- Emotion names and descriptions
- Mantra meanings and instructions
- Error messages and notifications

## 🧪 Development

### **Available Scripts**

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### **Environment Variables**

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Guidelines**

- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Maintain responsive design
- Add proper error handling
- Include accessibility features
- Test on multiple devices

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- **Sanskrit Mantras**: Traditional texts and authentic pronunciations
- **Devanagari Script**: Noto Sans Devanagari font support
- **Icons**: Lucide React and React Icons
- **Charts**: Recharts for beautiful data visualization
- **Backend**: Supabase for robust backend infrastructure

## 🌟 Future Enhancements

- **More Languages**: Additional language support
- **Advanced Analytics**: Machine learning insights
- **Community Features**: Sharing and social aspects
- **Mobile App**: Native iOS and Android apps
- **Voice Recognition**: Mantra pronunciation feedback
- **Meditation Timer**: Customizable session timers
- **Guided Meditations**: Audio-guided meditation sessions

---

**Made with ❤️ for your spiritual journey**

*सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः*  
*May all beings be happy, may all beings be free from illness*