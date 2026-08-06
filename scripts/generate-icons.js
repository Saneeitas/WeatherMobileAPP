/**
 * Generate app icon and splash assets using macOS built-in tools.
 * Run: node scripts/generate-icons.js
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Weather app icon SVG — sun with cloud
const iconSvg = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563EB"/>
      <stop offset="100%" style="stop-color:#60A5FA"/>
    </linearGradient>
    <linearGradient id="sun" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FBBF24"/>
      <stop offset="100%" style="stop-color:#F59E0B"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="1024" height="1024" rx="224" fill="url(#bg)"/>
  <!-- Sun -->
  <circle cx="460" cy="380" r="140" fill="url(#sun)"/>
  <!-- Sun rays -->
  <g stroke="#FBBF24" stroke-width="24" stroke-linecap="round" opacity="0.9">
    <line x1="460" y1="180" x2="460" y2="220"/>
    <line x1="460" y1="540" x2="460" y2="580"/>
    <line x1="260" y1="380" x2="300" y2="380"/>
    <line x1="620" y1="380" x2="660" y2="380"/>
    <line x1="319" y1="239" x2="347" y2="267"/>
    <line x1="573" y1="493" x2="601" y2="521"/>
    <line x1="319" y1="521" x2="347" y2="493"/>
    <line x1="573" y1="267" x2="601" y2="239"/>
  </g>
  <!-- Cloud -->
  <g opacity="0.95">
    <ellipse cx="580" cy="600" rx="160" ry="110" fill="white"/>
    <ellipse cx="480" cy="620" rx="120" ry="90" fill="white"/>
    <ellipse cx="680" cy="620" rx="100" ry="80" fill="white"/>
    <rect x="480" y="600" width="200" height="100" rx="0" fill="white"/>
  </g>
</svg>`;

// Adaptive icon foreground (no background, just the weather symbol)
const adaptiveSvg = (size) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sun" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FBBF24"/>
      <stop offset="100%" style="stop-color:#F59E0B"/>
    </linearGradient>
  </defs>
  <!-- Sun -->
  <circle cx="420" cy="360" r="130" fill="url(#sun)"/>
  <!-- Sun rays -->
  <g stroke="#FBBF24" stroke-width="22" stroke-linecap="round" opacity="0.9">
    <line x1="420" y1="170" x2="420" y2="210"/>
    <line x1="420" y1="510" x2="420" y2="550"/>
    <line x1="230" y1="360" x2="270" y2="360"/>
    <line x1="570" y1="360" x2="610" y2="360"/>
    <line x1="286" y1="226" x2="314" y2="254"/>
    <line x1="526" y1="466" x2="554" y2="494"/>
    <line x1="286" y1="494" x2="314" y2="466"/>
    <line x1="526" y1="254" x2="554" y2="226"/>
  </g>
  <!-- Cloud -->
  <g opacity="0.95">
    <ellipse cx="560" cy="580" rx="160" ry="110" fill="white"/>
    <ellipse cx="460" cy="600" rx="120" ry="90" fill="white"/>
    <ellipse cx="660" cy="600" rx="100" ry="80" fill="white"/>
    <rect x="460" y="580" width="200" height="100" rx="0" fill="white"/>
  </g>
</svg>`;

// Splash screen SVG
const splashSvg = (width, height) => `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2563EB"/>
      <stop offset="100%" style="stop-color:#60A5FA"/>
    </linearGradient>
    <linearGradient id="sun" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FBBF24"/>
      <stop offset="100%" style="stop-color:#F59E0B"/>
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bg)"/>
  <!-- Centered icon -->
  <g transform="translate(${(width - 200) / 2}, ${(height - 200) / 2})">
    <!-- Sun -->
    <circle cx="85" cy="70" r="45" fill="url(#sun)"/>
    <!-- Sun rays -->
    <g stroke="#FBBF24" stroke-width="6" stroke-linecap="round" opacity="0.9">
      <line x1="85" y1="10" x2="85" y2="22"/>
      <line x1="85" y1="118" x2="85" y2="130"/>
      <line x1="25" y1="70" x2="37" y2="70"/>
      <line x1="133" y1="70" x2="145" y2="70"/>
      <line x1="42" y1="27" x2="51" y2="36"/>
      <line x1="119" y1="104" x2="128" y2="113"/>
      <line x1="42" y1="113" x2="51" y2="104"/>
      <line x1="119" y1="36" x2="128" y2="27"/>
    </g>
    <!-- Cloud -->
    <g opacity="0.95">
      <ellipse cx="120" cy="130" rx="50" ry="35" fill="white"/>
      <ellipse cx="90" cy="136" rx="38" ry="28" fill="white"/>
      <ellipse cx="150" cy="136" rx="32" ry="25" fill="white"/>
      <rect x="90" y="130" width="60" height="30" fill="white"/>
    </g>
  </g>
  <!-- App name -->
  <text x="${width / 2}" y="${height / 2 + 150}" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="600" fill="white" opacity="0.9">Weather</text>
</svg>`;

// Write SVG files
const files = [
  { name: 'icon.svg', content: iconSvg(1024) },
  { name: 'adaptive-icon.svg', content: adaptiveSvg(1024) },
  { name: 'splash.svg', content: splashSvg(1284, 2778) },
];

files.forEach(({ name, content }) => {
  const filePath = path.join(ASSETS_DIR, name);
  fs.writeFileSync(filePath, content);
  console.log(`Created: ${filePath}`);
});

// Convert SVGs to PNGs using macOS 'qlmanage' or 'rsvg-convert' or 'sips'
// We'll use a node-based approach with resvg if available, otherwise raw export
function svgToPng(svgPath, pngPath, width, height) {
  try {
    // Try using rsvg-convert (from librsvg, often available via brew)
    execSync(`which rsvg-convert`, { stdio: 'pipe' });
    execSync(`rsvg-convert -w ${width} -h ${height} "${svgPath}" -o "${pngPath}"`, { stdio: 'pipe' });
    return true;
  } catch {
    // Fallback: use qlmanage (macOS built-in)
    try {
      execSync(`qlmanage -t -s ${width} -o "${path.dirname(pngPath)}" "${svgPath}" 2>/dev/null`, { stdio: 'pipe' });
      const generatedFile = svgPath + '.png';
      if (fs.existsSync(generatedFile)) {
        fs.renameSync(generatedFile, pngPath);
        return true;
      }
    } catch {}
  }
  return false;
}

// Generate PNGs
const pngTargets = [
  { svg: 'icon.svg', png: 'icon.png', w: 1024, h: 1024 },
  { svg: 'adaptive-icon.svg', png: 'adaptive-icon.png', w: 1024, h: 1024 },
  { svg: 'splash.svg', png: 'splash-icon.png', w: 1284, h: 2778 },
];

let pngSuccess = 0;
pngTargets.forEach(({ svg, png, w, h }) => {
  const svgPath = path.join(ASSETS_DIR, svg);
  const pngPath = path.join(ASSETS_DIR, png);
  if (svgToPng(svgPath, pngPath, w, h)) {
    console.log(`Converted: ${pngPath}`);
    pngSuccess++;
  } else {
    console.log(`⚠️  Could not convert ${svg} to PNG. Install rsvg-convert: brew install librsvg`);
  }
});

if (pngSuccess === 0) {
  console.log('\n📝 Manual conversion needed. You can:');
  console.log('   1. Install librsvg: brew install librsvg');
  console.log('   2. Run this script again');
  console.log('   OR open the SVGs in a browser and export as PNG');
}

console.log('\n✅ Icon generation complete!');
