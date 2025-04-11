# System Patterns for Novylist

## System Architecture
Novylist follows a client-server architecture with a React frontend and Node.js backend, using the following key architectural approaches:

### Frontend Architecture
- **Component-Based Structure** - Hierarchical React components with clear separation of concerns
- **State Management** - Redux Toolkit for global state management and React Context for localized state
- **UI Framework** - TailwindCSS for styling with emphasis on consistency and responsiveness
- **Editor Integration** - Draftjs/Quilljs for rich text editing capabilities
- **Client-Side Routing** - React Router for navigation between application sections

### Backend Architecture
- **API Layer** - RESTful API endpoints using Express.js
- **Database Layer** - MongoDB for document-based data storage
- **Real-Time Communication** - Socket.IO for collaborative features
- **AI Integration** - OpenAI API (GPT-4) for writing assistance features
- **Authentication** - JWT-based auth flow with MFA support

## Key Technical Decisions

### Frontend Technology Choices
- **React with Vite** - For component-based UI with fast development and hot module replacement
- **Redux Toolkit** - For predictable state management across the application
- **Draftjs/Quilljs** - For sophisticated rich text editing capabilities
- **TailwindCSS** - For utility-first styling approach with consistency

### Backend Technology Choices
- **Node.js/Express** - For JavaScript-based API development with robust middleware support
- **MongoDB** - For flexible document schema that accommodates complex narrative structures
- **Socket.IO** - For managing real-time collaborative editing
- **OpenAI API (GPT-4)** - For AI-powered writing assistance

### Data Storage Strategy
- **Document-Oriented Design** - Using MongoDB's document model for hierarchical narrative structures
- **Version Control Mechanism** - Custom implementation for tracking draft history and branching

## Design Patterns in Use

### Frontend Patterns
- **Component Composition** - Building complex UI from smaller, reusable components
- **Container/Presentational Pattern** - Separating logic from presentation
- **Hooks Pattern** - Using React hooks for stateful logic and side effects
- **Render Props Pattern** - For component composition with shared logic

### Backend Patterns
- **MVC Architecture** - Controllers for business logic, models for data access
- **Middleware Pattern** - For authentication, logging, error handling
- **Repository Pattern** - Abstracting data access layer
- **Observer Pattern** - For real-time updates in collaborative features

### AI Integration Patterns
- **Strategy Pattern** - For different AI assistance modes based on user preferences
- **Adapter Pattern** - For integrating the OpenAI API
- **Command Pattern** - For encapsulating AI requests and operations

## Component Relationships

### Frontend Component Hierarchy
```
App
├── Auth Components (Login, Register, MFA)
├── Dashboard
│   ├── ProjectList
│   └── UserStats
├── Editor
│   ├── WritingCanvas (Draftjs/Quilljs)
│   ├── AIAssistancePanel
│   ├── VersionControl
│   └── CollaborationTools
└── NarrativeManager
    ├── PlotStructure
    ├── CharacterManager
    ├── TimelineView
    └── ProgressVisualizer
```

### Backend Module Relationships
```
Server
├── Auth Controllers
├── Novel Controllers
├── User Controllers
├── AI Service
│   ├── Prompt Generation
│   ├── Content Analysis
│   └── Adaptive Nudging
├── Collaboration Service
└── Database Models
    ├── User Model
    ├── Novel Model
    └── Settings Model
```

## Critical Implementation Paths

### User Authentication Flow
1. User submits credentials → Auth controller validates → JWT issued
2. JWT included in subsequent requests → Middleware validates → Access granted to protected resources

### AI-Assisted Writing Flow
1. User writes in editor → Content analyzed → Context extracted
2. Context sent to AI service → Prompts generated → Suggestions returned
3. Suggestions displayed in UI → User accepts/rejects → Content updated

### Version Control Implementation
1. User creates snapshot → Differential changes stored → Version history updated
2. User creates branch → Base version copied → Independent edits tracked
3. Branch merging → Conflicts identified → Resolution UI presented

### Real-Time Collaboration Implementation
1. User joins session → WebSocket connection established → Current document state synced
2. User makes edits → Changes broadcast via Socket.IO → Other users' views updated
3. Conflict detection → Lock mechanism or operational transforms → Consistent state maintained

## Performance Considerations
- **Frontend Optimization** - Code splitting, lazy loading, and memoization for React components
- **Backend Caching** - Redis or in-memory caching for frequently accessed data and AI responses
- **Database Indexing** - Strategic indexes on frequently queried fields
- **Network Optimization** - Compression and chunking for Socket.IO communications

## Security Implementation
- **Input Validation** - Server-side validation for all API endpoints
- **Authentication** - JWT with proper expiration and refresh mechanisms
- **Authorization** - Role-based access control for features and data
- **Data Protection** - Encryption for sensitive user data
- **API Security** - Rate limiting and CSRF protection

This document serves as a reference for the key architectural decisions, patterns, and relationships that define the Novylist system. It should be consulted when making significant changes to ensure consistency with the established architecture.
