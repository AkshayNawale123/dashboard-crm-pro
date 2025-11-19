# Executive CRM Dashboard - Cybaem Tech

## Project Overview
A comprehensive Executive CRM Dashboard application for managing client relationships and tracking project stages. This is a full-stack application migrated from Lovable to Replit's fullstack template architecture.

## Technology Stack
- **Frontend**: React 18 + TypeScript + Vite
  - UI Components: Shadcn UI with Radix UI primitives
  - Routing: wouter
  - State Management: TanStack Query (React Query)
  - Styling: Tailwind CSS
  
- **Backend**: Express 4 + Node.js
  - Runtime: tsx (TypeScript execution)
  - Data Layer: In-memory storage with Drizzle ORM schemas
  
- **Build Tools**: Vite 5 for frontend bundling

## Project Structure
```
├── client/               # Frontend application
│   ├── src/
│   │   ├── components/  # React components including Shadcn UI
│   │   ├── pages/      # Page components
│   │   ├── lib/        # Utilities and query client
│   │   ├── hooks/      # Custom React hooks
│   │   ├── types/      # TypeScript type definitions
│   │   └── assets/     # Static assets (images, etc.)
│   ├── index.html      # HTML entry point
│   └── public/         # Public static files
│
├── server/              # Backend application
│   ├── index.ts        # Express server entry point
│   ├── routes.ts       # API route handlers
│   ├── storage.ts      # Data storage interface and implementation
│   └── vite.ts         # Vite dev server integration
│
└── shared/              # Shared code between frontend and backend
    └── schema.ts       # Drizzle schemas and Zod validation
```

## Features
- Client relationship management with full CRUD operations
- Pipeline tracking and metrics visualization
- Project status and negotiation tracking
- Client history and activity logging
- Advanced filtering and search capabilities
- CSV export functionality

## Development
The application uses:
- Port 5000 for the development server (bound to 0.0.0.0)
- Hot module replacement via Vite
- TypeScript for type safety across the stack
- In-memory storage (can be upgraded to PostgreSQL if needed)

## Recent Changes (November 19, 2025)
- Migrated from Lovable platform to Replit fullstack template
- Restructured project to follow Replit conventions (client/, server/, shared/ directories)
- Replaced react-router-dom with wouter for routing
- Configured Express server with Vite integration
- Set up in-memory storage with Drizzle ORM schemas
- Created API endpoints for client management
- Configured build and deployment settings

## Known Issues
- UI components (metric cards, filter bar, clients table) may not be fully rendering despite data being available from API
- Need to investigate CSS/component loading issues
- react-router-dom was removed in favor of wouter

## API Endpoints
- `GET /api/clients` - Fetch all clients with history
- `GET /api/clients/:id` - Fetch single client
- `POST /api/clients` - Create new client
- `PATCH /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client
- `POST /api/clients/:id/history` - Add client history entry

## User Preferences
- None documented yet

## Deployment Notes
- Deployment is configured for autoscale target
- Build command: `npm run build`
- Start command: `npm run start`
- Frontend builds to `dist/public/`
