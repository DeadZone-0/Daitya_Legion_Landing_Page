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
  content = content.replace(/text-red-/g, 'text-green-');
  content = content.replace(/bg-red-/g, 'bg-green-');
  content = content.replace(/border-red-/g, 'border-green-');
  fs.writeFileSync(file, content);
  console.log('Updated ' + file);
});
