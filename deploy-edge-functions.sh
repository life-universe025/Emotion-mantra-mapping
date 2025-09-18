#!/bin/bash

# Deploy Supabase Edge Functions
echo "🚀 Deploying Supabase Edge Functions..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase. Please run:"
    echo "   supabase login"
    exit 1
fi

# Deploy functions
echo "📦 Deploying mantras function..."
supabase functions deploy mantras

echo "📦 Deploying sessions function..."
supabase functions deploy sessions

echo "📦 Deploying user-stats function..."
supabase functions deploy user-stats

echo "✅ All functions deployed successfully!"
echo ""
echo "🔗 Your API endpoints are now available at:"
echo "   https://your-project-id.supabase.co/functions/v1/mantras"
echo "   https://your-project-id.supabase.co/functions/v1/sessions"
echo "   https://your-project-id.supabase.co/functions/v1/user-stats"
