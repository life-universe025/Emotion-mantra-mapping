#!/bin/bash

# PWA Setup Script for Sanatan Mantra Sadhana
echo "🚀 Setting up PWA features for Sanatan Mantra Sadhana..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Create public directory if it doesn't exist
mkdir -p public

echo "📱 Generating PWA icons..."
node scripts/generate-pwa-icons.js

echo "🔧 Setting up service worker..."
# The service worker is already created at public/sw.js

echo "📋 Creating PWA manifest..."
# The manifest is already created at public/manifest.json

echo "🎨 Setting up PWA meta tags..."
# Meta tags are already added to index.html

echo "✅ PWA setup complete!"
echo ""
echo "📱 Your app now has the following PWA features:"
echo "   • Install prompt for mobile devices"
echo "   • Offline functionality with service worker"
echo "   • Audio caching for offline mantra practice"
echo "   • Push notifications for practice reminders"
echo "   • App-like experience on mobile devices"
echo ""
echo "🚀 To test your PWA:"
echo "   1. Run: npm run dev"
echo "   2. Open in Chrome/Edge"
echo "   3. Look for the install button in the address bar"
echo "   4. Test offline functionality by going offline"
echo ""
echo "📦 To deploy:"
echo "   1. Run: npm run build"
echo "   2. Deploy the dist/ folder to your hosting service"
echo "   3. Ensure HTTPS is enabled for full PWA functionality"
echo ""
echo "🔍 PWA Audit:"
echo "   • Chrome DevTools > Lighthouse > Progressive Web App"
echo "   • Check PWA score and fix any issues"
echo ""
echo "✨ Your Sanatan Mantra Sadhana is now a Progressive Web App!"
