const fs = require('fs');
let code = fs.readFileSync('src/pages/Vehicles.tsx', 'utf-8');

if (!code.includes('useSearchParams')) {
  code = code.replace(
    `import { Link } from 'react-router-dom';`,
    `import { Link, useSearchParams } from 'react-router-dom';`
  );
  
  code = code.replace(
    `const [filterCategory, setFilterCategory] = useState<string>('ALL');`,
    `const [filterCategory, setFilterCategory] = useState<string>('ALL');
  const [searchParams] = useSearchParams();
  const location = searchParams.get('location');
  const startDate = searchParams.get('pickup');
  const endDate = searchParams.get('return');`
  );
  
  code = code.replace(
    `useEffect(() => {
    dispatch(fetchVehicles());
  }, [dispatch]);`,
    `useEffect(() => {
    const params: Record<string, string> = {};
    if (location) params.location = location;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    dispatch(fetchVehicles(params));
  }, [dispatch, location, startDate, endDate]);`
  );
  fs.writeFileSync('src/pages/Vehicles.tsx', code);
}
