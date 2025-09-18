#!/bin/bash

# Supabase Database Migration Setup Script
# This script helps set up and migrate your Supabase database

echo "🚀 Setting up Supabase database migration..."

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed. Please install it first:"
    echo "   brew install supabase/tap/supabase"
    exit 1
fi

echo "✅ Supabase CLI is installed"

# Check if we're in the right directory
if [ ! -f "supabase/config.toml" ]; then
    echo "❌ Supabase config not found. Make sure you're in the project root directory."
    exit 1
fi

echo "✅ Supabase configuration found"

# Start Supabase local development
echo "🔄 Starting Supabase local development environment..."
supabase start

# Check if start was successful
if [ $? -eq 0 ]; then
    echo "✅ Supabase local environment started successfully!"
    echo ""
    echo "📋 Next steps:"
    echo "1. Your local Supabase instance is running at: http://127.0.0.1:54323"
    echo "2. Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
    echo "3. API URL: http://127.0.0.1:54321"
    echo "4. Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0"
    echo ""
    echo "🔧 To apply migrations to a remote database:"
    echo "   supabase db push --linked"
    echo ""
    echo "🛑 To stop the local environment:"
    echo "   supabase stop"
else
    echo "❌ Failed to start Supabase local environment"
    exit 1
fi
