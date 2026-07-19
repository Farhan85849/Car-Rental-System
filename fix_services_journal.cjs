const fs = require('fs');

const replacements = {
  // Services
  'client/src/pages/Services.tsx': [
    {
      find: /image:\s*"[^"]*"/g,
      replace: (match, offset) => {
        if (offset < 500) return `image: "https://images.pexels.com/photos/3764984/pexels-photo-3764984.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"`; // Airport Transfer
        if (offset > 500 && offset < 900) return `image: "https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"`; // Chauffeur Service
        if (offset > 900 && offset < 1300) return `image: "https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"`; // Corporate Rentals
        return `image: "https://images.pexels.com/photos/909907/pexels-photo-909907.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"`; // Wedding & Events
      }
    }
  ],
  // Journal
  'client/src/pages/Journal.tsx': [
    {
      find: /image:\s*"[^"]*"/g,
      replace: (match, offset) => {
        if (offset < 500) return `image: "https://images.pexels.com/photos/100656/pexels-photo-100656.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"`;
        if (offset > 500 && offset < 900) return `image: "https://images.pexels.com/photos/358070/pexels-photo-358070.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"`;
        return `image: "https://images.pexels.com/photos/3311574/pexels-photo-3311574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"`;
      }
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
