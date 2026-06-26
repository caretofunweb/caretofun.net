const fs = require('fs');
const path = require('path');

const images = [
  '/images/ai-automation.png',
  '/images/ai-everyday.png',
  '/images/ai-future.png',
  '/images/ai-image-generation.png',
  '/images/ai-vibe-coding.png',
  '/images/ai-video-generation.png',
  '/images/machine-learning.png'
];

const postsDir = path.join(__dirname, 'src', 'content', 'posts');
const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

let imgIndex = 0;
let updated = 0;

files.forEach(file => {
  const filePath = path.join(postsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Only add image if it doesn't already have one
  if (!content.includes('image: ')) {
    const selectedImage = images[imgIndex % images.length];
    
    // Inject image below featured
    content = content.replace('featured: false', `featured: false\nimage: "${selectedImage}"`);
    
    fs.writeFileSync(filePath, content);
    imgIndex++;
    updated++;
  }
});

console.log('Successfully added placeholder images to ' + updated + ' posts!');
