# Technical Context for Novylist

## Technologies Used

### Frontend
- **ReactJS** - Main UI framework for building component-based interfaces
- **Vite** - Build tool and development server with fast HMR (Hot Module Replacement)
- **Redux Toolkit** - State management library for predictable application state
- **Draftjs/Quilljs** - Rich text editing libraries for the writing canvas
- **TailwindCSS** - Utility-first CSS framework for styling

### Backend
- **Node.js** - JavaScript runtime for server-side code
- **Express.js** - Web framework for building the API layer
- **MongoDB** - NoSQL database for storing document-based data
- **Socket.IO** - Library for real-time, bidirectional communication
- **JWT** - Authentication mechanism for securing API endpoints

### AI Integration
- **OpenAI API** - External service for AI-powered features
- **GPT-4** - Large language model used for writing assistance

### Development Tools
- **Git** - Version control system for source code management
- **Jest/Mocha** - Testing frameworks for unit and integration tests
- **Cypress** - End-to-end testing framework
- **ESLint** - Linting tool for code quality
- **Webpack** - Module bundler (used internally by Vite)

## Development Setup

### Local Environment Setup
1. Node.js (LTS version) and npm installation required
2. MongoDB instance (local or cloud-based)
3. OpenAI API key for AI features
4. Git for version control

### Environment Configuration
- `.env` files for environment-specific configuration with placeholders for:
  - MongoDB connection string
  - JWT secret
  - OpenAI API credentials
  - Environment indicator (development/production)

### Development Workflow
1. Clone repository and install dependencies (`npm install`)
2. Configure environment variables
3. Start development server (`npm run dev`)
4. Run tests (`npm test`) and linting (`npm run lint`)
5. Build for production (`npm run build`)

## Technical Constraints

### Performance Requirements
- API response times under 500ms for AI-powered endpoints
- Editor responsiveness with minimal input lag
- Real-time collaboration with low latency
- Support for large documents without performance degradation

### Security Requirements
- HTTPS for all communications
- Input validation and sanitization for all user inputs
- JWT tokens with proper expiration and refresh mechanisms
- Secure storage of user credentials (hashed passwords)
- Protection against common web vulnerabilities (XSS, CSRF, etc.)

### Scalability Considerations
- Horizontal scaling for API servers
- Efficient database queries with proper indexing
- Caching strategies for frequently accessed data
- Performance monitoring and bottleneck identification

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
- draft-js or quill for rich text editing
- socket.io-client for real-time features
- tailwindcss for styling

### Backend Dependencies
- express for API routing
- mongoose for MongoDB object modeling
- jsonwebtoken for JWT authentication
- bcrypt for password hashing
- socket.io for WebSocket communication
- openai for AI API integration

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
- Continuous integration with automated testing

### Deployment Process
- CI/CD pipeline for automated deployments
- Staging environment for pre-production testing
- Blue-green deployment for zero-downtime updates
- Automated rollback procedures for failed deployments

### Code Quality Maintenance
- Linting and formatting checks in CI pipeline
- Code reviews for all changes
- Documentation requirements for public APIs
- Performance monitoring and profiling

### Monitoring and Logging
- Centralized logging system
- Error tracking and alerting
- Performance metrics collection
- User behavior analytics

## Development Standards

### Coding Style Guidelines
- JavaScript/React best practices
- Airbnb style guide as a base reference
- Early returns and minimal nesting
- Descriptive variable names and comments for complex logic

### File Structure Recommendations
- Feature-based organization for frontend components
- Clear separation of concerns (MVC pattern for backend)
- Modular design with clear interfaces between components
- Consistent naming conventions (see projectbrief.md)

### API Design Principles
- RESTful endpoints with clear resource naming
- Consistent response formats with status codes
- Proper error handling and validation
- Versioning for backward compatibility

This document serves as a reference for the technical context of Novylist, providing developers with the necessary information to understand the technology stack, development environment, and best practices for contributing to the project.
