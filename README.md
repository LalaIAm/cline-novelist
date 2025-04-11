# Novylist

Novylist is an AI-enhanced novel writing platform designed to assist authors throughout the entire creative process, from initial ideation to publishing. The platform provides guidance, real-time feedback, customizable AI profiles, and seamless navigation throughout the creative process.

## Project Status

This project is currently in Phase 1: Research and Design. We are setting up the development environment and establishing the foundation for the platform.

## Tech Stack

### Frontend
- **ReactJS** - Main UI framework for building component-based interfaces
- **Vite** - Build tool and development server with fast HMR
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

## Getting Started

### Prerequisites

- Node.js (LTS version) and npm installed
- MongoDB instance (local or cloud-based)
- OpenAI API key for AI features

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd novylist
   ```

2. Install frontend dependencies
   ```
   npm install
   ```

3. Install backend dependencies
   ```
   cd server
   npm install
   cd ..
   ```

4. Set up environment variables
   - Create a `.env` file in the root directory based on `.env.example`
   - Create a `.env` file in the `server` directory based on `server/.env.example`

### Running the Development Environment

1. Start the backend server
   ```
   cd server
   npm run dev
   ```

2. In a separate terminal, start the frontend development server
   ```
   npm run dev
   ```

3. Access the application at `http://localhost:3000`

## Development Progress

### Implemented Features
- Project setup and configuration
- Basic frontend and backend structure
- Editor comparison for technical spike (Draft.js vs Quill.js)

### In Progress
- Authentication system
- Database schema design
- User interface design

## Editor Comparison

As part of our technical spike, we have implemented both Draft.js and Quill.js editors for evaluation. You can access the comparison page at `/editor-comparison` to test and evaluate both editors.

## Project Structure

### Frontend Structure
```
src/
  components/        # Reusable UI components
    editors/         # Editor implementations (Draft.js, Quill.js)
  pages/             # Page-level components
  utils/             # Utility functions and helpers
  styles/            # CSS and TailwindCSS configuration
  redux/             # Redux store and slices
  main.jsx           # Main entry point
```

### Backend Structure
```
server/
  src/
    controllers/     # Business logic for API endpoints
    routes/          # API route definitions
    models/          # MongoDB data models
    middleware/      # Custom middleware (auth, error handling)
    config/          # Configuration files
  server.js          # Main server entry point
```

## License

[MIT License](LICENSE)

## Contact

For questions or feedback, please contact the project maintainers.
