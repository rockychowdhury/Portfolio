const sharp = require('sharp');
const fs = require('fs');

async function processImages() {
  console.log('Processing darktexture.jpg...');
  await sharp('public/assets/papers/darktexture.jpg')
    .resize(1600, null, { withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile('public/assets/papers/darktexture.webp');
    
  console.log('Processing whitetexture.jpg...');
  await sharp('public/assets/papers/whitetexture.jpg')
    .resize(1600, null, { withoutEnlargement: true })
    .webp({ quality: 75 })
    .toFile('public/assets/papers/whitetexture.webp');
    
  console.log('Done!');
}

processImages().catch(console.error);
