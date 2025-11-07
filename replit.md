# TAUlab Equipment Management Platform

## Overview

TAUlab is a construction equipment management platform designed to automate equipment tracking, maintenance scheduling, and reporting for construction companies. The system replaces manual processes with automated usage tracking through IoT sensors (IMU, GPS, BLE), provides real-time visibility into equipment status and location, and generates comprehensive reports for billing and operational insights.

**Core Value Proposition**: Minimize manual data entry, automate maintenance reminders, and provide transparency into equipment utilization across multiple job sites.

**Target Users**: Construction equipment managers, mechanics, site operators, and administrative staff managing fleets of heavy machinery, vehicles, and tools.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System**:
- React 18 with TypeScript for type safety
- Vite as build tool and development server
- Wouter for lightweight client-side routing (no React Router)
- TanStack Query (React Query) for server state management and caching
- TanStack Table for complex data grid functionality

**UI Component Strategy**:
- Shadcn/ui component library (New York variant) with Radix UI primitives
- Tailwind CSS for utility-first styling with custom design system
- Custom CSS variables for theme management (light/dark mode support)
- Design system prioritizes data density and field-ready usability (tablet-optimized, touch-friendly)

**State Management Approach**:
- Server state managed through React Query with aggressive caching (`staleTime: Infinity`)
- Local UI state handled with React hooks
- No global state management library (Redux/Zustand) - kept intentionally simple
- Session management through HTTP-only cookies

**Design Philosophy**:
- System-based approach inspired by Material Design and Carbon Design System
- Typography: Inter for UI, JetBrains Mono for equipment IDs and numeric data
- Color-coded status indicators (Green/Yellow/Red) for immediate understanding
- Spreadsheet-style layouts prioritizing data transparency
- Spacing primitives: Tailwind units of 2, 3, 4, 6, 8, 12 for consistency

### Backend Architecture

**Server Framework**:
- Express.js with TypeScript for REST API
- ESM module system throughout (`"type": "module"`)
- Separation of concerns: `routes.ts` for endpoints, `storage.ts` for data access layer
- Custom logging middleware with request/response tracking

**API Design**:
- RESTful endpoints following `/api/{resource}` convention
- CRUD operations for Equipment, Custom Fields, Sites, Maintenance
- Request validation using Zod schemas (derived from Drizzle schemas)
- JSON request/response format with proper HTTP status codes
- Error handling with descriptive messages

**Database Layer**:
- Drizzle ORM as type-safe query builder
- Schema-first approach with `shared/schema.ts` defining all tables
- Automatic TypeScript types generated from schema definitions
- Migration strategy: `drizzle-kit push` for schema synchronization

**Session Management**:
- Express session middleware with PostgreSQL session store (connect-pg-simple)
- Secure session cookies with HTTP-only flags
- User authentication through username/password (hashed)

### Data Storage Solutions

**Primary Database**:
- PostgreSQL via Neon serverless driver (`@neondatabase/serverless`)
- Connection pooling for efficient resource utilization
- WebSocket support for serverless environments

**Schema Design**:
- `users`: Authentication and user profiles
- `equipment`: Core asset tracking (name, type, location, maintenance status, hours, operator)
- `customFields`: User-defined field definitions for extensibility
- `customFieldOptions`: Select dropdown options for custom fields
- `customFieldValues`: Actual values for custom fields per equipment
- `savedViews`: User-saved table configurations (column visibility, filters)

**Status Code System**:
- Maintenance and ERR (Equipment Repair Request) statuses use coded format: `G_1` (Good), `Y_2` (Warning), `R_3` (Critical)
- Enables both color-coding and priority sorting in a single field
- Status fields stored as text for flexibility

**Custom Fields Architecture**:
- Dynamic schema extension without database migrations
- Support for text, number, and select field types
- Optional equipment type filtering (e.g., fields only for Excavators)
- Display order management for UI rendering

### Authentication and Authorization

**Current Implementation**:
- Basic username/password authentication
- Session-based authentication with PostgreSQL-backed session store
- User records stored in `users` table with hashed passwords
- No role-based access control (RBAC) in current schema - single-tier access

**Security Considerations**:
- Credentials included in requests (`credentials: "include"`)
- 401 handling in query client with configurable behavior
- Password hashing (implementation details in authentication middleware)

### External Dependencies

**Third-Party UI Libraries**:
- Radix UI primitives for accessible, unstyled components (dialogs, dropdowns, tooltips, etc.)
- Lucide React for icon system
- QRCode.react for equipment QR code generation
- date-fns for date manipulation and formatting
- cmdk for command palette/search interfaces

**Development & Build Tools**:
- TypeScript compiler for type checking
- PostCSS with Autoprefixer for CSS processing
- ESBuild for production server bundling
- tsx for running TypeScript in development

**Monitoring & Development**:
- Replit-specific plugins for development experience (runtime error overlay, cartographer, dev banner)
- Custom logging system with timestamp formatting

**Database & ORM**:
- @neondatabase/serverless for PostgreSQL connectivity
- drizzle-orm for query building
- drizzle-kit for schema migrations
- drizzle-zod for automatic Zod schema generation

**Planned Integrations** (based on feature list):
- IMU sensors for equipment state detection (OFF/IDLE/MOVING/WORKING)
- GPS modules for geofencing and location tracking
- BLE tags for small unpowered asset tracking
- Email service for maintenance notifications and reports
- PDF generation for invoicing and reports

**Notable Architectural Decisions**:

1. **Monorepo Structure**: Client, server, and shared code in single repository with path aliases (`@/`, `@shared/`)
2. **Shared Schema**: Database schema definitions shared between frontend and backend for type consistency
3. **No ORM Models**: Direct Drizzle queries rather than model abstractions - keeps codebase transparent
4. **Aggressive Caching**: React Query configured with infinite stale time - optimizes for read-heavy workload
5. **Storage Abstraction**: IStorage interface pattern allows for future database swapping or testing
6. **Custom Fields System**: Enables user customization without code changes - critical for varied equipment types
7. **Status Code Encoding**: Combines color indicator and priority in single field for efficient querying and sorting