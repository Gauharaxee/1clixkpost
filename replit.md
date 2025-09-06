# PostMaster - Social Media Management Platform

## Overview

PostMaster is a comprehensive social media management platform that enables users to create, schedule, and publish content across multiple social media platforms (Meta/Facebook, X/Twitter, LinkedIn, and Google) from a unified interface. The application provides analytics, content management, and scheduling capabilities with a modern, responsive web interface.

The system is built as a full-stack web application with React frontend, Express.js backend, and PostgreSQL database using Drizzle ORM for data management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Custom component library built with Radix UI primitives and Tailwind CSS
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **Build Tool**: Vite for development and production builds

The frontend follows a component-based architecture with:
- Layout components for consistent page structure
- Feature-specific components organized by domain (dashboard, create-post, etc.)
- Reusable UI components with shadcn/ui design system
- Form handling with React Hook Form and Zod validation

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM for type-safe database operations
- **File Upload**: Multer for handling media file uploads
- **Development**: Hot reloading with Vite integration
- **API Design**: RESTful API with consistent error handling

The backend implements:
- Route-based API structure with middleware for logging and error handling
- Memory-based storage interface that can be swapped for database implementation
- File upload handling with validation and storage management
- Mock data services for development and testing

### Database Design
PostgreSQL database with the following core entities:
- **Users**: User accounts with authentication and profile data
- **Platform Connections**: OAuth connections to social media platforms
- **Posts**: Content posts with scheduling and status tracking
- **Post Platforms**: Many-to-many relationship between posts and target platforms

The schema supports:
- Multi-platform posting with platform-specific metadata
- Post scheduling with status tracking (draft, scheduled, published, failed)
- Social media account management with token storage
- Analytics data collection and storage

### Authentication & Authorization
- Session-based authentication (placeholder implementation)
- Platform-specific OAuth integration for social media connections
- User-scoped data access with proper authorization checks

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-kit**: CLI tools for database migrations and schema management

### UI & Frontend
- **@radix-ui/***: Headless UI components for accessibility
- **@tanstack/react-query**: Server state management and caching
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight client-side routing
- **react-hook-form**: Form handling and validation
- **zod**: TypeScript-first schema validation

### File & Media Handling
- **multer**: Multipart form data handling for file uploads
- **uuid**: Unique identifier generation for uploaded files

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **@replit/vite-plugin-***: Replit-specific development plugins

### Social Media Integration
The application is designed to integrate with:
- **Meta/Facebook API**: For posting to Facebook pages and personal profiles
- **X (Twitter) API**: For tweet publishing and account management
- **LinkedIn API**: For professional content sharing
- **Google My Business API**: For business profile updates

### Deployment & Infrastructure
- **Neon**: Serverless PostgreSQL database hosting
- **File Storage**: Local file system (upgradeable to cloud storage)
- **Session Management**: In-memory sessions (upgradeable to Redis/database)