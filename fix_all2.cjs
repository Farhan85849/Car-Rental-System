const fs = require('fs');

function replaceFileContent(filePath, searchRegex, replaceText) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(searchRegex, replaceText);
  fs.writeFileSync(filePath, content, 'utf8');
}

replaceFileContent('src/features/auth/pages/Login.tsx', /@\/src\/store\/authSlice/g, "@/src/features/auth/store/authSlice");
replaceFileContent('src/features/auth/pages/Register.tsx', /@\/src\/store\/authSlice/g, "@/src/features/auth/store/authSlice");
replaceFileContent('src/features/auth/providers/AuthProvider.tsx', /@\/src\/store\/authSlice/g, "@/src/features/auth/store/authSlice");
replaceFileContent('src/layouts/Navbar.tsx', /@\/src\/store\/authSlice/g, "@/src/features/auth/store/authSlice");

// Home.tsx issue: src/pages/Home.tsx(22,14): Expected 1-2 arguments, but got 0.
// Likely dispatch(fetchVehicles());
// Let's replace dispatch(fetchVehicles()) with dispatch(fetchVehicles({})) if it needs it, or change the thunk. Let's just pass {}.
replaceFileContent('src/pages/Home.tsx', /dispatch\(fetchVehicles\(\)\)/g, "dispatch(fetchVehicles({}))");
