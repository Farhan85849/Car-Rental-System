# Endrive Full-Stack Architecture

## Backend
The backend runs on Express.js and Prisma, structured into layers to separate concerns:
- **Routes:** Only handle defining endpoints and calling controllers.
- **Controllers:** Extract data from req, call the appropriate service, and format res.
- **Services:** Contain core business logic (auth, booking validation, overlapping checks).
- **Repositories:** Contain raw Prisma database access logic and transactions.

## Frontend
The React application follows a feature-driven architecture:
- **`src/features/`**: Grouped by domain (auth, vehicles, bookings, admin). Inside each feature, we have `components`, `pages`, and `store` (Redux slices).
- **`src/api/`**: Axios configuration and base paths.
- **`src/components/common/`**: Shared components across multiple features.
- **`src/layouts/`**: Application layouts like Navbar and Footer.
- **`src/store/`**: Root Redux store configured to compose all feature slices.
