const fs = require('fs');
let code = fs.readFileSync('src/pages/booking/BookingWizard.tsx', 'utf-8');

if (!code.includes('useSelector')) {
  code = code.replace(
    `import { useParams, useNavigate } from 'react-router-dom';`,
    `import { useParams, useNavigate, Navigate } from 'react-router-dom';\nimport { useSelector } from 'react-redux';\nimport { RootState } from '../../store/store';`
  );
  
  code = code.replace(
    `const { vehicleId } = useParams();`,
    `const { vehicleId } = useParams();\n  const { user } = useSelector((state: RootState) => state.auth);`
  );
  
  code = code.replace(
    `  if (loading) {`,
    `  if (!user) {\n    return <Navigate to="/login" />;\n  }\n\n  if (loading) {`
  );
  
  fs.writeFileSync('src/pages/booking/BookingWizard.tsx', code);
}
