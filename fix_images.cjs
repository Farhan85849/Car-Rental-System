const fs = require('fs');
let code = fs.readFileSync('server/prisma/seed.ts', 'utf-8');

code = code.replace(
  `const getImages = (category: string) => {
  switch (category) {
    case 'ECONOMY':
      return JSON.stringify([
        'https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=2069&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2070&auto=format&fit=crop'
      ]);
    case 'COMPACT':
      return JSON.stringify([
        'https://images.unsplash.com/photo-1549317661-bd32c8ce0be2?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=2070&auto=format&fit=crop'
      ]);
    case 'SEDAN':
      return JSON.stringify([
        'https://images.unsplash.com/photo-1550355291-bbee04a92027?q=80&w=2036&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=2072&auto=format&fit=crop'
      ]);
    case 'SUV':
      return JSON.stringify([
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2071&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'
      ]);
    case 'VIP':
      return JSON.stringify([
        'https://images.unsplash.com/photo-1563720223185-11003d516935?q=80&w=2032&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1605515298946-d062f2e9da53?q=80&w=2022&auto=format&fit=crop'
      ]);
    default:
      return JSON.stringify([
        'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2183&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop'
      ]);
  }
};`,
  `const getImages = (category: string) => {
  switch (category) {
    case 'VIP':
      return JSON.stringify([
        'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop', // Porsche
        'https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=2070&auto=format&fit=crop'
      ]);
    case 'SEDAN':
      return JSON.stringify([
        'https://images.unsplash.com/photo-1616422285623-13ff0162193c?q=80&w=2062&auto=format&fit=crop', // Mercedes
        'https://images.unsplash.com/photo-1606664515524-ed2f786a0b65?q=80&w=2070&auto=format&fit=crop'
      ]);
    case 'SUV':
      return JSON.stringify([
        'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?q=80&w=2071&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?q=80&w=2070&auto=format&fit=crop'
      ]);
    default:
      return JSON.stringify([
        'https://images.unsplash.com/photo-1503376760366-5a413e832041?q=80&w=2070&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1583121274602-3e2820c69888?q=80&w=2070&auto=format&fit=crop'
      ]);
  }
};`
);

fs.writeFileSync('server/prisma/seed.ts', code);
