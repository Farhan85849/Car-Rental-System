const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const fileMoves = {
  // Layouts
  'src/components/Navbar.tsx': 'src/layouts/Navbar.tsx',
  'src/components/Footer.tsx': 'src/layouts/Footer.tsx',
  
  // Auth Feature
  'src/pages/Login.tsx': 'src/features/auth/pages/Login.tsx',
  'src/pages/Register.tsx': 'src/features/auth/pages/Register.tsx',
  'src/components/AuthProvider.tsx': 'src/features/auth/providers/AuthProvider.tsx',
  'src/store/slices/authSlice.ts': 'src/features/auth/store/authSlice.ts',
  
  // Vehicles Feature
  'src/pages/Vehicles.tsx': 'src/features/vehicles/pages/Vehicles.tsx',
  'src/pages/VehicleDetails.tsx': 'src/features/vehicles/pages/VehicleDetails.tsx',
  'src/store/slices/vehicleSlice.ts': 'src/features/vehicles/store/vehicleSlice.ts',
  
  // Bookings Feature
  'src/pages/MyBookings.tsx': 'src/features/bookings/pages/MyBookings.tsx',
  'src/pages/booking/BookingWizard.tsx': 'src/features/bookings/pages/BookingWizard.tsx',
  'src/components/BookingSearchPanel.tsx': 'src/features/bookings/components/BookingSearchPanel.tsx',
  'src/store/slices/bookingSlice.ts': 'src/features/bookings/store/bookingSlice.ts',
  
  // Admin Feature
  'src/pages/AdminDashboard.tsx': 'src/features/admin/pages/AdminDashboard.tsx',
  
  // Users Feature
  'src/pages/Profile.tsx': 'src/features/users/pages/Profile.tsx',
  
  // Common Components
  'src/components/Hero.tsx': 'src/components/common/Hero.tsx',
  
  // API
  'src/lib/api.ts': 'src/api/axios.ts',
};

// Also we need to move directories inside components/ if they exist and are empty or not.
// Let's recursively find all files in src
function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllFiles(filePath, fileList);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx')) {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
}

const allFiles = getAllFiles(srcDir);

// Map of old absolute path -> new absolute path
const pathMap = {};
for (const file of allFiles) {
  const relPath = path.relative(__dirname, file).replace(/\\/g, '/');
  if (fileMoves[relPath]) {
    pathMap[file] = path.join(__dirname, fileMoves[relPath]);
  } else {
    pathMap[file] = file; // no move
  }
}

// Function to resolve import path
function resolveImportPath(currentFilePath, importPath) {
  if (!importPath.startsWith('.')) return null; // not a relative import
  
  let targetPath = path.resolve(path.dirname(currentFilePath), importPath);
  
  // extensions to check
  const exts = ['.ts', '.tsx', '/index.ts', '/index.tsx'];
  for (const ext of exts) {
    if (fs.existsSync(targetPath + ext)) {
      return targetPath + ext;
    }
  }
  return targetPath; // fallback
}

for (const file of allFiles) {
  let content = fs.readFileSync(file, 'utf8');
  let contentChanged = false;
  
  // Regex to match imports
  const importRegex = /import\s+(?:(?:\*\s+as\s+\w+)|(?:\{[^}]+\})|(?:\w+))(?:\s*,\s*(?:(?:\{[^}]+\})|(?:\*\s+as\s+\w+)))?\s+from\s+['"]([^'"]+)['"]/g;
  
  content = content.replace(importRegex, (match, importPath) => {
    if (!importPath.startsWith('.')) return match;
    
    const resolvedOldPath = resolveImportPath(file, importPath);
    if (resolvedOldPath && pathMap[resolvedOldPath]) {
      const newTargetPath = pathMap[resolvedOldPath];
      const newCurrentPath = pathMap[file];
      
      // We can use @/src alias!
      // newTargetPath is absolute like /app/applet/src/features/auth/pages/Login.tsx
      const relToRoot = path.relative(__dirname, newTargetPath).replace(/\\/g, '/');
      // strip extension
      const withoutExt = relToRoot.replace(/\.tsx?$/, '');
      const aliasImport = `@/${withoutExt}`;
      contentChanged = true;
      return match.replace(importPath, aliasImport);
    }
    return match;
  });
  
  // also handle export ... from '...'
  const exportRegex = /export\s+(?:(?:\*\s+as\s+\w+)|(?:\{[^}]+\})|(?:\*))\s+from\s+['"]([^'"]+)['"]/g;
  content = content.replace(exportRegex, (match, importPath) => {
    if (!importPath.startsWith('.')) return match;
    const resolvedOldPath = resolveImportPath(file, importPath);
    if (resolvedOldPath && pathMap[resolvedOldPath]) {
      const newTargetPath = pathMap[resolvedOldPath];
      const relToRoot = path.relative(__dirname, newTargetPath).replace(/\\/g, '/');
      const withoutExt = relToRoot.replace(/\.tsx?$/, '');
      const aliasImport = `@/${withoutExt}`;
      contentChanged = true;
      return match.replace(importPath, aliasImport);
    }
    return match;
  });

  if (contentChanged || pathMap[file] !== file) {
    // If we are moving, we write to new path
    const target = pathMap[file];
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content, 'utf8');
    if (target !== file) {
      fs.unlinkSync(file);
    }
  }
}

console.log("Refactoring complete.");
