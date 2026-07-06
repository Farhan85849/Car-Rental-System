const fs = require('fs');
const path = 'client/src/components/common/Hero.tsx';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/<img src="\/images\/hero_bg\.jpg".*?\/>/, '<img src="/images/hero_bg.jpg" alt="Hero Background" className="absolute inset-0 w-full h-full object-cover opacity-100" />');
content = content.replace(/<div className="absolute inset-0 bg-\[radial-gradient\(circle_at_center,transparent_0%,#030303_100%\)\].*?\/>/, '<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#030303_100%)] opacity-30" />');
content = content.replace(/<div className="absolute inset-0 bg-gradient-to-b from-\[#030303\]\/80 via-transparent to-\[#030303\].*?\/>/, '<div className="absolute inset-0 bg-gradient-to-b from-[#030303]/40 via-transparent to-[#030303]/80" />');

fs.writeFileSync(path, content);
