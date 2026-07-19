const fs = require('fs');

const replacements = {
  // Locations
  'client/src/pages/Locations.tsx': [
    {
      find: /image:\s*"[^"]*"/g,
      replace: (match, offset, str) => {
        if (offset < 500) return `image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c8/Badshahi_Mosque_front_picture.jpg/1280px-Badshahi_Mosque_front_picture.jpg"`; // Lahore
        if (offset > 500 && offset < 900) return `image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Seaview_%28Clifton_Beach%29_Karachi.jpg/1280px-Seaview_%28Clifton_Beach%29_Karachi.jpg"`; // Karachi
        return `image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Faisal_Mosque_and_Margalla_Hills.jpg/1280px-Faisal_Mosque_and_Margalla_Hills.jpg"`; // Islamabad
      }
    }
  ],
  // Hero
  'client/src/components/common/Hero.tsx': [
    {
      find: /https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg[^'"]*/g,
      replace: () => 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' // Mercedes S-Class
    }
  ],
  // Home Banner (Immersive Video Banner)
  'client/src/pages/Home.tsx': [
    {
      find: /https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg[^'"]*/g,
      replace: () => 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ],
  // About
  'client/src/pages/About.tsx': [
    {
      find: /https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg[^'"]*/g,
      replace: () => 'https://images.pexels.com/photos/2127733/pexels-photo-2127733.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ],
  // Profile (Background)
  'client/src/features/users/pages/Profile.tsx': [
    {
      find: /https:\/\/images\.pexels\.com\/photos\/\d+\/pexels-photo-\d+\.jpeg[^'"]*/g,
      replace: () => 'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    }
  ]
};

for (const [file, rules] of Object.entries(replacements)) {
  let content = fs.readFileSync(file, 'utf8');
  for (const rule of rules) {
    content = content.replace(rule.find, rule.replace);
  }
  fs.writeFileSync(file, content);
  console.log('Fixed ' + file);
}
