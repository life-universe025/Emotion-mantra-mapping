#!/bin/bash

# Deploy mood tracking database migration and edge functions
# This script updates the database schema and edge functions to support mood tracking

set -e

echo "🚀 Deploying mood tracking features..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

# Check if we're in a Supabase project
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Not in a Supabase project directory. Please run this from the project root."
    exit 1
fi

echo "📊 Applying mood tracking database migration..."
supabase db push

echo "🔧 Deploying updated sessions edge function..."
supabase functions deploy sessions

echo "✅ Mood tracking deployment complete!"
echo ""
echo "📋 What was deployed:"
echo "   • Database schema updates (mood tracking columns)"
echo "   • Mood analytics triggers and functions"
echo "   • Updated sessions edge function with mood validation"
echo "   • Performance indexes for mood queries"
echo ""
echo "🎯 New features available:"
echo "   • Before/after mood tracking (1-10 scale)"
echo "   • Mood improvement calculations"
echo "   • Mood analytics in user stats"
echo "   • Data validation for mood values"
echo ""
echo "🧪 Test the mood tracking by:"
echo "   1. Starting a mantra practice session"
echo "   2. Completing the practice"
echo "   3. Selecting before/after moods in reflection"
echo "   4. Checking your user stats for mood analytics"
