#!/usr/bin/env node

/**
 * PWA Icon Generator Script
 * Generates PWA icons from a base SVG icon
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base SVG icon (Om symbol with spiritual theme)
const baseSVG = `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f97316;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="symbol" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fef3c7;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background circle -->
  <circle cx="256" cy="256" r="240" fill="url(#bg)" stroke="#fbbf24" stroke-width="8"/>
  
  <!-- Om symbol -->
  <g transform="translate(256, 256)">
    <!-- Main Om curve -->
    <path d="M -80 -20 Q -40 -40 0 -20 Q 40 0 0 20 Q -40 40 -80 20 Q -60 0 -80 -20" 
          fill="url(#symbol)" stroke="#f59e0b" stroke-width="3"/>
    
    <!-- Om dot -->
    <circle cx="60" cy="-10" r="8" fill="url(#symbol)"/>
    
    <!-- Om crescent -->
    <path d="M 50 -20 Q 60 -10 50 0" 
          fill="none" stroke="url(#symbol)" stroke-width="4" stroke-linecap="round"/>
    
    <!-- Decorative elements -->
    <circle cx="-100" cy="-100" r="4" fill="url(#symbol)" opacity="0.6"/>
    <circle cx="100" cy="-100" r="4" fill="url(#symbol)" opacity="0.6"/>
    <circle cx="-100" cy="100" r="4" fill="url(#symbol)" opacity="0.6"/>
    <circle cx="100" cy="100" r="4" fill="url(#symbol)" opacity="0.6"/>
  </g>
</svg>
`;

// Icon sizes to generate
const iconSizes = [
  { size: 192, name: 'pwa-192.png' },
  { size: 512, name: 'pwa-512.png' },
  { size: 192, name: 'pwa-maskable-192.png', maskable: true },
  { size: 512, name: 'pwa-maskable-512.png', maskable: true },
  { size: 96, name: 'shortcut-practice.png' },
  { size: 96, name: 'shortcut-profile.png' }
];

// Splash screen sizes
const splashSizes = [
  { width: 375, height: 812, name: 'splash-iphone.png', device: 'iPhone' },
  { width: 768, height: 1024, name: 'splash-ipad.png', device: 'iPad' }
];

// Create public directory if it doesn't exist
const publicDir = path.join(__dirname, '..', 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Generate SVG for each size
function generateSVG(size, maskable = false) {
  const padding = maskable ? size * 0.1 : 0; // 10% padding for maskable icons
  const iconSize = size - (padding * 2);
  
  return `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f59e0b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f97316;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="symbol" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fef3c7;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  
  <!-- Icon content centered -->
  <g transform="translate(${size/2}, ${size/2}) scale(${iconSize/512})">
    <!-- Om symbol -->
    <g>
      <!-- Main Om curve -->
      <path d="M -80 -20 Q -40 -40 0 -20 Q 40 0 0 20 Q -40 40 -80 20 Q -60 0 -80 -20" 
            fill="url(#symbol)" stroke="#f59e0b" stroke-width="3"/>
      
      <!-- Om dot -->
      <circle cx="60" cy="-10" r="8" fill="url(#symbol)"/>
      
      <!-- Om crescent -->
      <path d="M 50 -20 Q 60 -10 50 0" 
            fill="none" stroke="url(#symbol)" stroke-width="4" stroke-linecap="round"/>
    </g>
  </g>
</svg>
  `.trim();
}

// Generate splash screen SVG
function generateSplashSVG(width, height) {
  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#fef3c7;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#fde68a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="symbol" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#fef3c7;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  
  <!-- App icon -->
  <g transform="translate(${width/2}, ${height/2 - 50})">
    <circle cx="0" cy="0" r="80" fill="url(#symbol)" stroke="#f59e0b" stroke-width="4"/>
    <g transform="scale(0.8)">
      <!-- Om symbol -->
      <path d="M -40 -10 Q -20 -20 0 -10 Q 20 0 0 10 Q -20 20 -40 10 Q -30 0 -40 -10" 
            fill="#f59e0b" stroke="#f97316" stroke-width="2"/>
      <circle cx="30" cy="-5" r="4" fill="#f59e0b"/>
      <path d="M 25 -10 Q 30 -5 25 0" 
            fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
    </g>
  </g>
  
  <!-- App name -->
  <text x="${width/2}" y="${height/2 + 80}" text-anchor="middle" 
        font-family="Inter, sans-serif" font-size="32" font-weight="600" 
        fill="#f59e0b">Sanatan Mantra Sadhana</text>
  
  <!-- Subtitle -->
  <text x="${width/2}" y="${height/2 + 110}" text-anchor="middle" 
        font-family="Inter, sans-serif" font-size="16" font-weight="400" 
        fill="#f59e0b" opacity="0.8">Transform Emotions Through Sacred Mantras</text>
</svg>
  `.trim();
}

// Write SVG files
function writeSVGFiles() {
  console.log('Generating PWA icons...');
  
  // Generate icon SVGs
  iconSizes.forEach(({ size, name, maskable }) => {
    const svg = generateSVG(size, maskable);
    const filePath = path.join(publicDir, name.replace('.png', '.svg'));
    fs.writeFileSync(filePath, svg);
    console.log(`Generated ${name.replace('.png', '.svg')}`);
  });
  
  // Generate splash screen SVGs
  splashSizes.forEach(({ width, height, name, device }) => {
    const svg = generateSplashSVG(width, height);
    const filePath = path.join(publicDir, name.replace('.png', '.svg'));
    fs.writeFileSync(filePath, svg);
    console.log(`Generated ${name.replace('.png', '.svg')} for ${device}`);
  });
  
  console.log('\nPWA icons generated successfully!');
  console.log('\nNote: You may want to convert these SVG files to PNG using an online converter or image processing tool for better compatibility.');
  console.log('Recommended tools:');
  console.log('- Online: https://convertio.co/svg-png/');
  console.log('- CLI: ImageMagick, Inkscape');
  console.log('- Node.js: sharp, svg2png');
}

// Run the script
writeSVGFiles();

export { generateSVG, generateSplashSVG, iconSizes, splashSizes };
