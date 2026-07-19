const fs = require('fs');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = dir + '/' + f;
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const pexelsCars = [
  '120049', '170811', '2127733', '1149137', '112460', '707046', '116675', '1035108',
  '3729464', '3752194', '3764984', '919073', '1402787', '909907', '100656', '358070',
  '3311574', '3802510'
];

let matchCount = 0;
walk('client/src', function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    if (content.includes('images.unsplash.com')) {
      content = content.replace(/https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^'"]*/g, () => {
        const id = pexelsCars[(matchCount++) % pexelsCars.length];
        return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2`;
      });
      fs.writeFileSync(filePath, content);
      console.log('Updated ' + filePath);
    }
  }
});
console.log('Total replaced in frontend: ' + matchCount);
