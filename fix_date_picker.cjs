const fs = require('fs');
let code = fs.readFileSync('src/index.css', 'utf-8');

code = code.replace(
  /\.custom-date-picker::-webkit-calendar-picker-indicator {[\s\S]*?}/,
  `.custom-date-picker::-webkit-calendar-picker-indicator {
  opacity: 0;
  cursor: pointer;
  position: absolute;
  right: 0;
  top: 0;
  width: 100%;
  height: 100%;
}`
);
code = code.replace(
  /\.custom-date-picker::-webkit-calendar-picker-indicator:hover {[\s\S]*?}/,
  ``
);

fs.writeFileSync('src/index.css', code);
