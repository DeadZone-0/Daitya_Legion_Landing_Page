import fs from 'fs';
const files = [
  'frontend/src/components/Hero.jsx',
  'frontend/src/pages/Home.jsx',
  'frontend/src/pages/Rankings.jsx',
  'frontend/src/components/PlayerCard.jsx',
  'frontend/src/components/PlayerDetailsModal.jsx',
  'frontend/src/components/CaptainSection.jsx',
  'frontend/src/components/ViceCaptainSection.jsx'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/text-green-/g, 'text-red-');
  content = content.replace(/bg-green-/g, 'bg-red-');
  content = content.replace(/border-green-/g, 'border-red-');
  fs.writeFileSync(file, content);
  console.log('Reverted ' + file);
});
