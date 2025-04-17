# System Patterns for Novylist

## System Architecture
Novylist follows a client-server architecture with a React frontend and Node.js backend, using the following key architectural approaches:

### Frontend Architecture
- **Component-Based Structure** - Hierarchical React components with clear separation of concerns
- **State Management** - Redux Toolkit for global state management and React Context for localized state
- **UI Framework** - TailwindCSS for styling with emphasis on consistency and responsiveness
- **Editor Integration** - Quill.js for rich text editing capabilities
- **Client-Side Routing** - React Router for navigation between application sections

### Backend Architecture
- **API Layer** - RESTful API endpoints using Express.js
- **Database Layer** - MongoDB for document-based data storage
- **Real-Time Communication** - Socket.IO for collaborative features
- **AI Integration** - Provider-agnostic architecture supporting multiple AI providers with initial OpenAI implementation
- **Authentication** - JWT-based auth flow with MFA support

## Key Technical Decisions

### Frontend Technology Choices
- **React with Vite** - For component-based UI with fast development and hot module replacement
- **Redux Toolkit** - For predictable state management across the application
- **Quill.js** - For sophisticated rich text editing capabilities with customization
- **TailwindCSS** - For utility-first styling approach with consistency

### Backend Technology Choices
- **Node.js/Express** - For JavaScript-based API development with robust middleware support
- **MongoDB** - For flexible document schema that accommodates complex narrative structures
- **Socket.IO** - For managing real-time collaborative editing
- **OpenAI API (GPT-4)** - For AI-powered writing assistance

### Data Storage Strategy
- **Document-Oriented Design** - Using MongoDB's document model for hierarchical narrative structures
- **Reference-Based Relationships** - Using document references instead of embedding for flexibility and performance
- **Version Control Mechanism** - Parent-child relationship between versions with branching support
- **Polymorphic References** - For flexible entity relationships (e.g., comments)
- **Emotional and Narrative Tracking** - Specialized fields for tracking narrative arcs and character development

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
- **Virtual Population Pattern** - Using Mongoose virtuals for relationship loading

### AI Integration Patterns
- **Provider-Agnostic Architecture** - Interface-based design allowing multiple AI providers
- **Strategy Pattern** - For different AI assistance modes based on user preferences
- **Adapter Pattern** - For integrating with different AI providers (OpenAI, Google Vertex AI)
- **Command Pattern** - For encapsulating AI requests and operations
- **Factory Pattern** - For creating appropriate provider instances
- **Observer Pattern** - For streaming token-by-token responses
- **Context Handling Pattern** - For managing novel-length content with token budgeting
- **Prompt Template System** - For standardized communication with AI models

## Database Schema Structure

### Core Models and Relationships
```
Novel (top-level container)
├── Versions (version control snapshots)
│   ├── Chapters (major narrative divisions)
│   │   ├── Scenes (narrative units)
│   │   │   └── Beats (smallest narrative elements)
├── Characters (entities in the narrative)
│   └── Relationships (connections between characters)
├── PlotElements (events, conflicts, decisions)
└── Comments (feedback attached to any entity)
```

### Key Schema Design Principles
- **Hierarchical Narrative Structure** - Novel → Version → Chapter → Scene → Beat
- **Version Control with Branching** - Parent-child relationships between versions
- **Character Attribute Organization** - Physical, personality, and background attributes
- **Emotional Arc Tracking** - Fields for tracking emotional values and tension
- **Timeline and Structure Positioning** - For plot visualization and structure analysis
- **Polymorphic References** - For attaching comments to any entity type
- **Comprehensive Indexing** - Strategic indexes for query optimization

## Component Relationships

### Frontend Component Hierarchy
```
App
├── Auth Components (Login, Register, MFA)
├── Dashboard
│   ├── ProjectList
│   └── UserStats
├── Editor
│   ├── WritingCanvas (Quill.js)
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
    ├── Version Model
    ├── Chapter Model
    ├── Scene Model
    ├── Beat Model
    ├── Character Model
    ├── Relationship Model
    ├── PlotElement Model
    └── Comment Model
```

## Critical Implementation Paths

### User Authentication Flow
1. User submits credentials → Auth controller validates → JWT issued
2. JWT included in subsequent requests → Middleware validates → Access granted to protected resources

### AI-Assisted Writing Flow
1. User writes in editor → Content analyzed → Context extracted with token budget allocation
2. Content sent to provider-agnostic AI service → Provider selected based on feature/preferences
3. Context packaged with appropriate prompt template → Request sent to selected provider
4. Results normalized for consistent interface → Results streamed token-by-token if enabled
5. Suggestions displayed in AI panel → User inserts content → Content updated in editor

### Version Control Implementation
1. User creates snapshot → New version created → Linked to parent version
2. User creates branch → New version with branch flag → Independent development path
3. Branch merging → Conflicts identified → Resolution UI presented

### Narrative Structure Management
1. Novel contains versions → Active version displayed to user
2. Version contains chapters → Chapters contain scenes → Scenes contain beats
3. Writer navigates hierarchy → Edits appropriate level → Content saved to database

### Character and Plot Management
1. Characters defined at novel level → Appear in scenes and beats
2. Relationships connect characters → Show dynamics and evolution
3. Plot elements organized in timeline → Linked to scenes and characters

## Performance Considerations
- **Frontend Optimization** - Code splitting, lazy loading, and memoization for React components
- **Backend Caching** - Redis or in-memory caching for frequently accessed data and AI responses
- **Database Indexing** - Strategic indexes on frequently queried fields
- **Document Size Management** - References instead of embedding for large collections
- **Query Optimization** - Field selection and controlled population depths
- **Network Optimization** - Compression and chunking for Socket.IO communications

## Security Implementation
- **Input Validation** - Server-side validation for all API endpoints
- **Authentication** - JWT with proper expiration and refresh mechanisms
- **Authorization** - Role-based access control for features and data
- **Data Protection** - Encryption for sensitive user data
- **API Security** - Rate limiting and CSRF protection

This document serves as a reference for the key architectural decisions, patterns, and relationships that define the Novylist system. It should be consulted when making significant changes to ensure consistency with the established architecture.
