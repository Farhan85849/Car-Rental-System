const fs = require('fs');
let code = fs.readFileSync('client/src/features/admin/pages/AdminDashboard.tsx', 'utf8');
code = code.replace(
  /        <\/div>\n      <\/div>\n    <\/div>\n  \);\n};\n\nexport default AdminDashboard;/g,
  `        </div>\n        <AdminInspections />\n      </div>\n    </div>\n  );\n};\n\nexport default AdminDashboard;`
);
fs.writeFileSync('client/src/features/admin/pages/AdminDashboard.tsx', code);
