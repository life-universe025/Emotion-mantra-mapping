#!/bin/bash

echo "🚀 Setting up Emotion Mantra Mapping..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  Creating .env file from template..."
    cp env.example .env
    echo "📝 Please edit .env file with your Supabase credentials"
    echo "   - VITE_SUPABASE_URL=your_supabase_project_url"
    echo "   - VITE_SUPABASE_ANON_KEY=your_supabase_anon_key"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up your Supabase project:"
echo "   - Create a new project at https://supabase.com"
echo "   - Run the SQL scripts in supabase-schema.sql and supabase-seed-data.sql"
echo "   - Get your project URL and anon key from Settings > API"
echo "   - Update your .env file with these credentials"
echo ""
echo "2. Start the development server:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "Happy meditating! 🧘‍♀️"
