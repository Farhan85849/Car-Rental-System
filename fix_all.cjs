const fs = require('fs');

function replaceFileContent(filePath, searchRegex, replaceText) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(searchRegex, replaceText);
  fs.writeFileSync(filePath, content, 'utf8');
}

// 1. Hero.tsx
replaceFileContent('src/components/common/Hero.tsx', /import BookingSearchPanel from '\.\/BookingSearchPanel';/, "import BookingSearchPanel from '@/src/features/bookings/components/BookingSearchPanel';");

// 2. AdminDashboard.tsx
replaceFileContent('src/features/admin/pages/AdminDashboard.tsx', /import api from '\.\.\/lib\/api';/, "import api from '@/src/api/axios';");

// 3. BookingWizard.tsx
replaceFileContent('src/features/bookings/pages/BookingWizard.tsx', /import api from '\.\.\/\.\.\/lib\/api';/, "import api from '@/src/api/axios';");

// 4. MyBookings.tsx
replaceFileContent('src/features/bookings/pages/MyBookings.tsx', /import api from '\.\.\/lib\/api';/, "import api from '@/src/api/axios';");

// 5. Vehicles.tsx
// wait, the error is: Property 'vehicles' does not exist on type '{}'.
// This is because RootState type is broken.

// 6. main.tsx
replaceFileContent('src/main.tsx', /import \{ AuthProvider \} from '\.\/components\/AuthProvider';/, "import { AuthProvider } from '@/src/features/auth/providers/AuthProvider';");

// 7. Home.tsx
replaceFileContent('src/pages/Home.tsx', /import Hero from '\.\.\/components\/Hero';/, "import Hero from '@/src/components/common/Hero';");

// 8. store.ts
replaceFileContent('src/store/store.ts', /import vehicleReducer from '\.\/slices\/vehicleSlice';/, "import vehicleReducer from '@/src/features/vehicles/store/vehicleSlice';");
replaceFileContent('src/store/store.ts', /import authReducer from '\.\/slices\/authSlice';/, "import authReducer from '@/src/features/auth/store/authSlice';");
replaceFileContent('src/store/store.ts', /import bookingReducer from '\.\/slices\/bookingSlice';/, "import bookingReducer from '@/src/features/bookings/store/bookingSlice';");
