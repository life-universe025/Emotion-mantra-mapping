#!/bin/bash

# CDN Upload Script for Sanskrit Mantra Audio
# Configure your CDN settings below

# CDN Configuration
CDN_BUCKET="your-bucket-name"
CDN_REGION="us-east-1"
CDN_URL="https://your-cdn.com"

# AWS S3 Upload (example)
echo "Uploading audio files to CDN..."

# Upload all MP3 files
aws s3 cp final/ s3://$CDN_BUCKET/audio/ --recursive --acl public-read

# Set proper content type
aws s3 cp s3://$CDN_BUCKET/audio/ s3://$CDN_BUCKET/audio/ --recursive --metadata-directive REPLACE --content-type "audio/mpeg"

echo "Upload complete!"
echo "Audio files available at: $CDN_URL/audio/"

# Alternative: Cloudflare R2
# rclone copy final/ r2:your-bucket/audio/

# Alternative: Vercel/Netlify
# Just drag and drop the final/ folder to your hosting service
