# Cursor Rules for Novylist

## Overview
This document provides coding style guidelines, naming conventions, file structure, error handling, testing protocols, documentation standards, security practices, and performance considerations for Novylist. These rules apply across the tech stack (ReactJS, Vite, NodeJS, Redux Toolkit, ExpressJS, MongoDB, SocketIO, Veritex AI, OpenAI API, GPT-4, Draftjs, and Quilljs).

## General Coding Principles
- Follow user requirements precisely.
- Think step-by-step using detailed pseudocode before implementation.
- Write correct, best practice, DRY, and bug-free code that is fully functional and follows the coding guidelines.
- Ensure code is complete, with no todos or placeholders.
- Include all necessary imports and dependencies.
- Prioritize readability over micro-optimizations. 
- Use early returns and avoid nested code where possible.

## Naming Conventions
- **Variables/Constants**: Use descriptive camelCase names. Example: `const userToken = "...";`
- **Functions**: Use descriptive names with a `handle` prefix for event-driven functions. Example: `const handleClick = () => { ... }`.
- **Components**: Use PascalCase for React components (e.g., `NavBar`, `Dashboard`).
- **Files/Folders**: Use kebab-case for file and folder names (e.g., `user-profile.js`, `api-routes`).

## File and Folder Structure Recommendations
- **Frontend**: 
  - `/src/components`: Contains reusable UI components. 
  - `/src/pages`: Contains page-level components.
  - `/src/utils`: Utility functions and helpers.
  - `/src/styles`: Contains TailwindCSS configuration and style files.
- **Backend**:  
  - `/src/controllers`: Contains business logic for different endpoints.
  - `/src/routes`: Defines API routing (using ExpressJS).
  - `/src/models`: Contains MongoDB data models.
  - `/src/middleware`: Contains custom middleware for error handling, authentication, etc.
  - `/src/config`: Contains environment configuration and constants.

## Error Handling and Logging Patterns
- Always use try-catch blocks in asynchronous functions.
- Early return on error conditions.
- Log errors using a centralized logging mechanism (e.g., Winston, Bunyan).
- Use standardized error response formats with code, message, and context.

## Testing Requirements and Patterns
- **Unit Tests**: Use Jest or Mocha for unit tests of critical functions and components.
- **Integration Tests**: Write tests to ensure that integration points, such as API endpoints between frontend and backend, work as expected.
- **End-to-End Tests**: Use frameworks like Cypress to test critical user flows (e.g., registration, login, creative drafting, etc.).
- Ensure test coverage for error scenarios and edge cases.

## Documentation Standards
- Document all functions, components, and API endpoints with JSDoc or similar commenting formats.
- Maintain an updated README and developer documentation outlining setup, build, test, and deployment processes.
- Include inline comments only for non-obvious logic.

## Security Practices
- Validate and sanitize all inputs (both client and server side).
- Encrypt sensitive data.
- Use environment variables to manage secrets; place placeholders in `.env` files.
- Integrate middleware for CSRF and XSS protection on server endpoints.
- Follow OWASP guidelines for secure coding.

## Performance Considerations
- Optimize React components using memoization and proper key usage in lists.
- Use lazy loading and code splitting for large components.
- Cache frequently accessed data and use efficient query patterns in MongoDB.
- Monitor performance and log potential bottlenecks.

## Code Implementation Guidelines (Example)
- Use early returns to simplify code structure.
- Always style using TailwindCSS; avoid inline CSS or external CSS files.
- Use descriptive variable names and avoid shallow naming.
- NEVER USE TYPESCRIPT. ONLY JAVASCRIPT!!!
- For instance, in React:

```jsx
import React from 'react';

const ExampleComponent = ({ title }) => {
  if (!title) return null;

  const handleClick = () => {
    console.log('Clicked!');
  };

  return (
    <div className="p-4 bg-gray-100" role="button" tabIndex="0" aria-label="Example Button" onClick={handleClick} onKeyDown={(e) => e.key === 'Enter' && handleClick()}>
      <h1 className="text-xl font-bold">{title}</h1>
    </div>
  );
};

export default ExampleComponent;
```

- Always include necessary imports and ensure proper hook usage in React.


# Pre.dev Master Plan for Novylist

## Overview
This document describes a comprehensive step-by-step development plan for Novylist. The project will integrate advanced AI functionality with core writing tools. Below is a detailed roadmap aligned with the user stories and technical stack requirements. The tech stack used includes: ReactJS, Vite, Redux Toolkit, NodeJS, ExpressJS, MongoDB, SocketIO, OpenAI API, GPT-4, Draftjs, and Quilljs.

## Roadmap & Milestones

### Phase 1: Research and Design (Months 1-3)
1. **User Onboarding and Landing Page Development**
   - **Tasks**:
     - Develop detailed wireframes and UI/UX prototypes.
     - Create detailed technical architecture documentation outlining AI integration and version control.
   - **Dependencies**: Finalization of UI/UX design prototypes.
   - **Environment**: Setup project skeleton with placeholder env variables.

2. **Authentication & Authorization Module**
   - **Tasks**:
     - Design and implement user registration using NodeJS, ExpressJS with secure password hashing.
     - Integrate Multi-Factor Authentication (MFA) with appropriate third-party services.
     - Design role-based access control with a clear data model and API endpoints.
   - **APIs and Contracts**:
     - RESTful endpoints for registration, login, MFA verification.
     - Document response formats (JSON schema).
   - **Dependencies**: Completion of technical architecture documentation and database schema design.

### Phase 2: MVP Development (Months 4-8)
1. **Drafting and Outlining Modules
   - **Tasks**:
     - Develop AI-Powered Writing Assistance endpoints using NodeJS and OpenAI API. 
        - Implement backend API endpoint for dynamic prompt generation with performance target (< 500ms).
     - Design React components for the AI writing assistant (using Draftjs / Quilljs) integrated in a distraction-free writing mode.
     - Implement version control for managing draft revisions.
        - Use Git-based branch strategies or application-level versioning.
   - **Dependencies**: Completion of Phase 1 architecture, research, and authentication systems.

2. **Dynamic Plot and Character Management
   - **Tasks**:
     - Develop modules/components for managing plots, characters, and subplots in React.
     - Design data models in MongoDB for narrative structure: novel -> chapters -> scenes -> paragraphs.
     - Integrate visualization tools (using React) such as progress bars, roadmap buttons, and dynamic cues.
   - **API Contracts**:
     - RESTful endpoints to retrieve/save structured narrative data.
   - **Dependencies**: UI/UX prototypes approval.

3. **AI Customization & Adaptive Nudging**
   - **Tasks**:
     - Implement metrics tracking (word count, time, edit ratio) in the frontend and backend.
     - Develop an algorithm in NodeJS to adjust nudging frequency based on user progress.
     - Create a collapsible settings interface with tone/sensitivity sliders and genre-specific profiles in React.
   - **Dependencies**: Stable version of core writing modules.

### Phase 3: Beta Feature Expansion (Months 9-12)
1. **Real-Time Collaboration Features
   - **Tasks**:
     - Implement WebSocket communication using SocketIO for live collaboration.
     - Develop backend endpoints to coordinate multiple concurrent sessions.
     - Update UI components to reflect real-time changes and include conflict resolution strategies.
   - **Design Patterns**:
     - Use observer pattern and state management (React Context or Redux) for UI updates.
   - **Dependencies**: Completion of stable MVP modules.

2. **Enhanced AI Integration and Feedback Loops
   - **Tasks**:
     - Integrate additional AI capabilities, e.g., contextual writing assistance and sentiment analysis.
     - Expand API endpoints for specialized NLP tasks (fact-checking, character tracking, etc.).
     - Document API contracts and adopt a hybrid deployment strategy (edge and cloud) for latency-sensitive functions.
   - **Dependencies**: Stable integration of MVP AI endpoints.

### Phase 4: Final Testing and Launch (Months 13+)
1. **Comprehensive Quality Assurance and Performance Optimization
   - **Tasks**:
     - Implement extensive unit, integration, and end-to-end tests for all modules.
     - Conduct security audits, performance profiling, and stress tests.
     - Optimize API endpoints, React code splitting, lazy loading, and asset compression.
   - **Dependencies**: Complete feature integration from previous phases.

2. **Deployment and Post-Launch Strategy
   - **Tasks**:
     - Setup CI/CD pipelines for continuous deployment, including environment-specific configurations (placeholders in .env files).
     - Document rollback procedures, database migration strategies, and performance metrics for live monitoring.
   - **Dependencies**: Final QA sign-off and performance benchmarks met.

## Technical Implementation Specifications

### Component Interfaces & State Management
- **Component Hierarchy**: 
  - Individual components for AI prompt display, writing editor, settings panel, and roadmap overview.
  - Use React Context or Redux for state propagation.
- **Props & State Requirements**:
  - Include prop types for AI settings, narrative elements, and user authentication tokens.

### API Contract Between Frontend and Backend
- **Authentication Endpoints**: 
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/mfa
  - Response: { success: boolean, message: string, token?: string }
- **Writing Assistance Endpoint**:
  - GET /api/ai/prompts?genre=...
  - Response must include prompt data within 500ms.
- **Narrative Data Endpoints**:
  - CRUD operations for novels, chapters, scenes.

### Design Patterns & Algorithms
- Use the Observer pattern for real-time updates in collaboration.
- Use caching strategies in NodeJS (e.g., in-memory caching or Redis) for high-frequency data.
- Version control mechanism: Maintain document revisions with branching for alternative drafts.

### Data Schema Outline
- **User Model**: 
  - Fields: id (ObjectId), email (string), username (string), hashedPassword (string), role (enum), createdAt, updatedAt.
- **Novel Model**: 
  - Fields: id (ObjectId), userId (ref to User), title, chapters (array of Chapter sub-documents), versionHistory.
- **Chapter/Scene Model**:
  - Use nested documents in MongoDB with metadata such as word count, timestamps, and edit histories.
- **Indexing Strategy**:
  - Index by userId, novelId, and frequently queried narrative fields.

### Test Coverage Requirements
- **Unit Tests**: 
  - Functions for AI suggestion generation, nudging algorithm, and authentication flows.
- **Integration Tests**: 
  - API endpoint interactions, database operations, and WebSocket communication.
- **End-to-End Tests**: 
  - User flows including registration, writing, saving drafts, and collaborative editing.
- **Performance Benchmarks**:
  - Ensure responsive AI interactions (<500ms) and system scalability with multiple concurrent users.

### CI/CD and Deployment
- **Pipeline Stages**:
  - Linting, unit testing, integration testing, staging deployment, and production deployment.
- **Environment Configuration**:
  - Use .env files with placeholders for environment variables.
- **Migration and Rollback**:
  - Document database migration steps and rollback procedures in case of deployment issues.

### Error Handling Protocol
- Categorize errors (client vs. server errors) and provide standardized JSON error responses.
- Implement retry policies for transient failures with exponential backoff.
- Use centralized logging (e.g., Winston) to capture contextual error information for monitoring.

### Performance Optimization
- **Caching**: Implement caching for API responses (e.g., via Redis) with clear invalidation rules.
- **Code Splitting & Lazy Loading**: Use React lazy and Suspense for large components.
- **Asset Optimization**: Use tools like Webpack for compression and bundling.

## Conclusion
This master plan outlines the development roadmap, detailed technical specifications, and quality benchmarks for Novylist. The plan ensures that the final product will be a robust, scalable, and feature-rich AI-enhanced novel writing platform. Adhering to these guidelines will assist in delivering consistent, maintainable, and high-quality code in every phase of the project.
