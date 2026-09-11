const fs = require('fs');

// Simple 1x1 transparent PNG as base64
const transparentPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const iconsDir = './images';

if (!fs.existsSync(iconsDir)) {
    fs.mkdirSync(iconsDir, { recursive: true });
}

sizes.forEach(size => {
    const buffer = Buffer.from(transparentPNG, 'base64');
    fs.writeFileSync(`${iconsDir}/icon-${size}.png`, buffer);
    console.log(`Created icon-${size}.png`);
});

// Create favicon.ico (16x16 and 32x32)
fs.writeFileSync(`${iconsDir}/favicon-16.png`, Buffer.from(transparentPNG, 'base64'));
fs.writeFileSync(`${iconsDir}/favicon-32.png`, Buffer.from(transparentPNG, 'base64'));

console.log('All placeholder icons created!');