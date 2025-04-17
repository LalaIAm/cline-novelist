# Technical Context for Novylist

## Technologies Used

### Frontend
- **ReactJS** - Main UI framework for building component-based interfaces
- **Vite** - Build tool and development server with fast HMR (Hot Module Replacement)
- **Redux Toolkit** - State management library for predictable application state
- **Quill.js** - Rich text editor chosen for its extensibility and performance
- **TailwindCSS** - Utility-first CSS framework for styling

### Backend
- **Node.js** - JavaScript runtime for server-side code
- **Express.js** - Web framework for building the API layer
- **MongoDB** - NoSQL database for storing document-based data
- **Mongoose** - MongoDB object modeling for Node.js
- **Socket.IO** - Library for real-time, bidirectional communication
- **JWT** - Authentication mechanism for securing API endpoints

### AI Integration
- **Provider-Agnostic Architecture**
  - **AIServiceInterface** - Common interface for all AI providers
  - **Provider Adapters** - Implementation-specific adapters for different AI providers
  - **OpenAI Adapter** - Initial implementation for OpenAI API
  - **Context Handling Service** - Managing novel-length content for different providers
  - **Prompt Template Service** - Standardized prompt management
- **OpenAI Integration** 
  - **GPT-3.5-Turbo** - Primary model for standard writing assistance features
  - **GPT-4** - Premium model for advanced writing assistance features
  - **Embeddings API** - Used for semantic similarity search in context handling
- **Context Handling System** - Implementation for novel-length content
  - Token budget allocation for different context components
  - Context windowing strategies for long documents
  - Multi-level summarization for broader context
  - Semantic similarity search for relevant passages
  - Caching system to optimize token usage
- **Provider Selection Strategy**
  - Feature-specific provider routing
  - Fallback mechanisms for provider failure
  - User preference support
  - Cost optimization options

### Development Tools
- **Git** - Version control system for source code management
- **Jest/Mocha** - Testing frameworks for unit and integration tests
- **Cypress** - End-to-end testing framework
- **ESLint** - Linting tool for code quality
- **Prettier** - Code formatter for consistent styling

## Development Setup

### Local Environment Setup
1. Node.js (LTS version) and npm installation required
2. MongoDB instance (local or cloud-based)
3. OpenAI API key for AI features
4. Git for version control

### Environment Configuration
- `.env` files for environment-specific configuration with placeholders for:
  - MongoDB connection string
  - JWT secret and expiration settings
  - OpenAI API credentials
  - Email service configuration
  - OAuth provider credentials
  - Environment indicator (development/production)

### Development Workflow
1. Clone repository and install dependencies (`npm install`)
2. Configure environment variables
3. Start development server (`npm run dev`)
4. Run tests (`npm test`) and linting (`npm run lint`)
5. Build for production (`npm run build`)

## Database Design

### Schema Organization
- Hierarchical narrative structure (Novel → Version → Chapter → Scene → Beat)
- Character and relationship models for entity management
- Plot elements with timeline positioning
- Version control with parent-child relationships
- Polymorphic comment system

### Data Modeling Approach
- Document references for relationships instead of embedding
- Virtual fields for computed properties
- Middleware for timestamps and data validation
- Comprehensive indexing strategy
- Clear separation of content and metadata

### Query Patterns
- Population of related documents with controlled depth
- Text search across multiple models
- Timeline and structure-based queries
- Filtering by status, type, and metadata

## Technical Constraints

### Performance Requirements
- API response times under 500ms for AI-powered endpoints
- Editor responsiveness with minimal input lag
- Real-time collaboration with low latency
- Support for large documents without performance degradation
- Efficient querying with index utilization
- Document size management for narrative content

### Security Requirements
- HTTPS for all communications
- Input validation and sanitization for all user inputs
- JWT tokens with proper expiration and refresh mechanisms
- Secure storage of user credentials (hashed passwords)
- Protection against common web vulnerabilities (XSS, CSRF, etc.)
- Role-based access control for collaborative features

### Scalability Considerations
- Horizontal scaling for API servers
- Efficient database queries with proper indexing
- Caching strategies for frequently accessed data
- Performance monitoring and bottleneck identification
- Document references vs. embedding decisions
- Query optimization and selective population

### Browser Compatibility
- Support for modern browsers (Chrome, Firefox, Safari, Edge)
- Graceful degradation for older browsers
- Responsive design for various screen sizes
- Touch support for mobile devices

## Dependencies

### Frontend Dependencies
- react and react-dom for UI components
- react-router-dom for client-side routing
- @reduxjs/toolkit and react-redux for state management
- quill for rich text editing
- socket.io-client for real-time features
- tailwindcss for styling
- formik and yup for form validation

### Backend Dependencies
- express for API routing
- mongoose for MongoDB object modeling
- jsonwebtoken for JWT authentication
- bcryptjs for password hashing
- socket.io for WebSocket communication
- passport and passport strategies for authentication
- nodemailer for email services
- openai for AI API integration
- speakeasy for MFA token generation

### Development Dependencies
- vite for development server and building
- jest or mocha/chai for testing
- cypress for end-to-end testing
- eslint for linting
- prettier for code formatting

## Tool Usage Patterns

### Version Control Practices
- Feature branch workflow
- Pull request reviews before merging
- Semantic versioning for releases
- Conventional commit messages

### Testing Strategy
- Unit tests for business logic and utilities
- Integration tests for API endpoints
- End-to-end tests for critical user flows
- Database model validation tests
- Continuous integration with automated testing

### Deployment Process
- CI/CD pipeline for automated deployments
- Staging environment for pre-production testing
- Blue-green deployment for zero-downtime updates
- Automated rollback procedures for failed deployments
- Database migration planning

### Code Quality Maintenance
- Linting and formatting checks in CI pipeline
- Code reviews for all changes
- Documentation requirements for public APIs
- Performance monitoring and profiling
- Schema validation and index optimization

### Monitoring and Logging
- Centralized logging system
- Error tracking and alerting
- Performance metrics collection
- Database query performance monitoring
- User behavior analytics

## Development Standards

### Coding Style Guidelines
- JavaScript/React best practices
- Airbnb style guide as a base reference
- Early returns and minimal nesting
- Descriptive variable names and comments for complex logic
- Consistent schema and model patterns

### File Structure Recommendations
- Feature-based organization for frontend components
- Clear separation of concerns (MVC pattern for backend)
- Modular design with clear interfaces between components
- Consistent naming conventions (see projectbrief.md)
- Models organized by domain entities

### API Design Principles
- RESTful endpoints with clear resource naming
- Consistent response formats with status codes
- Proper error handling and validation
- Versioning for backward compatibility
- Population depth control for nested resources

### Database Patterns
- Consistent field naming across models
- Strategic use of references vs. embedding
- Virtual fields for computed properties
- Pre/post middleware for data transformations
- Index optimization for common queries
- Schema validation for data integrity

This document serves as a reference for the technical context of Novylist, providing developers with the necessary information to understand the technology stack, development environment, and best practices for contributing to the project.
