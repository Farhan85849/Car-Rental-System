const fs = require('fs');
let code = fs.readFileSync('server/prisma/seed.ts', 'utf-8');

// The replacement was:
// `bookingNumber: 'PKR-2026-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0'),\n      userId: $1,`
// Let's remove this from review and wishlist

code = code.replace(/await prisma\.review\.create\(\{\s+data: \{\s+bookingNumber: 'PKR-2026-'\s*\+\s*Math\.floor\(Math\.random\(\) \* 1000000\)\.toString\(\)\.padStart\(6, '0'\),\s+/g, 'await prisma.review.create({\n    data: {\n      ');

code = code.replace(/await prisma\.wishlist\.create\(\{\s+data: \{\s+bookingNumber: 'PKR-2026-'\s*\+\s*Math\.floor\(Math\.random\(\) \* 1000000\)\.toString\(\)\.padStart\(6, '0'\),\s+/g, 'await prisma.wishlist.create({\n    data: {\n      ');

fs.writeFileSync('server/prisma/seed.ts', code);
