#!/bin/bash

# Deploy Profile Analytics Edge Function
echo "🚀 Deploying Profile Analytics Edge Function..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "npm install -g supabase"
    exit 1
fi

# Check if user is logged in
if ! supabase projects list &> /dev/null; then
    echo "❌ Please login to Supabase first:"
    echo "supabase login"
    exit 1
fi

# Deploy the function
echo "📦 Deploying profile-analytics function..."
supabase functions deploy profile-analytics

if [ $? -eq 0 ]; then
    echo "✅ Profile Analytics function deployed successfully!"
    echo ""
    echo "🔗 Function URL: https://your-project.supabase.co/functions/v1/profile-analytics"
    echo ""
    echo "📋 Usage:"
    echo "GET /profile-analytics/users/{userId}/analytics"
    echo ""
    echo "🔧 Features:"
    echo "- Server-side milestone calculations"
    echo "- Optimized insights generation"
    echo "- Challenge progress tracking"
    echo "- Goal progress calculations"
    echo "- Reduced client-side processing"
else
    echo "❌ Failed to deploy profile-analytics function"
    exit 1
fi
