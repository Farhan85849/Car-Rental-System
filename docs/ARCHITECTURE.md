# Endrive Project Architecture

This project is structured as a full-stack monorepo containing a React frontend and an Express.js backend. The codebase has been refactored to align with enterprise best practices.

## Directory Layout

```text
project-root/
│
├── client/                     # React Frontend Application
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Axios configuration and API calls
│   │   ├── components/         # Shared and common React components
│   │   ├── features/           # Feature-based domain logic (auth, vehicles, bookings, etc.)
│   │   │   └── [feature_name]/ # Contains components, pages, and Redux slices for the feature
│   │   ├── layouts/            # Global layout wrappers (e.g., Navbar, Footer)
│   │   ├── pages/              # General pages not tied to a specific complex feature
│   │   └── store/              # Global Redux store configuration
│   ├── package.json            # Client-specific package configuration (for module resolution)
│   └── vite.config.ts          # Vite build configuration (outputs to root dist/)
│
├── server/                     # Express Backend Application
│   ├── src/
│   │   ├── config/             # Environment and external service configs
│   │   ├── controllers/        # Express route handlers
│   │   ├── routes/             # API route definitions
│   │   ├── services/           # Core business logic
│   │   ├── repositories/       # Database access and Prisma transactions
│   │   ├── middleware/         # Custom Express middleware (auth, error handling)
│   │   ├── prisma/             # Prisma schema, migrations, and seed scripts
│   │   └── server.ts           # Express application entry point
│   ├── package.json            # Server-specific package configuration
│   └── tsconfig.json           # Server TypeScript configuration
│
├── database/                   # Database schemas and backups
│   ├── schema.sql              # Raw SQL schema exports
│   └── er-diagram/             # Database relationships documentation
│
├── docs/                       # Project documentation
│   ├── DATABASE.md             # Detailed database documentation
│   └── ARCHITECTURE.md         # This architecture overview file
│
└── package.json                # Root package.json coordinating dev and build scripts
```

## Architectural Patterns

### Frontend
The frontend heavily relies on a **Feature-Based Architecture**. By keeping files grouped by the domain (e.g. `auth`, `vehicles`, `bookings`), it is significantly easier to scale and manage large applications. The root `src/components` only holds cross-cutting UI components (e.g. Buttons, Modals, Navbar). 
The Vite build outputs the static bundle to the root `dist/` directory, which the backend then serves.

### Backend
The backend utilizes a **Layered Service-Oriented Architecture**:
1. **Routes**: Maps incoming HTTP requests to their corresponding controller functions.
2. **Controllers**: Extracts HTTP params/body, delegates to a Service, and returns formatted JSON responses. It contains NO business logic.
3. **Services**: Contains the core business logic. It handles validations, complex operations (e.g. price calculation, double booking prevention), and relies on repositories for data fetching.
4. **Repositories**: The only layer allowed to directly query the database using Prisma. This encapsulates query logic and handles transactions.

## Build and Deployment
The `package.json` at the root orchestrates both the client and server.
- **Development**: Runs `vite` via middleware inside Express. Both client and server run concurrently on port 3000.
- **Production Build**: Compiles the React application into static assets (`dist/`), and bundles the Express application into a single `server.cjs` file using `esbuild`. The application is then started using standard Node.js targeting `server.cjs`.
