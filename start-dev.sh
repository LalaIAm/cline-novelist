#!/bin/bash

echo "Starting Novylist Development Server for Phase 2"
echo "=============================================="
echo ""

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  yarn install
  
  # Check if the installation was successful
  if [ $? -ne 0 ]; then
    echo "Error installing dependencies. Please check your yarn configuration."
    exit 1
  fi
fi

# Start the development server
echo "Starting the development server..."
echo "Open http://localhost:3000/writing-workspace to view the Phase 2 implementation."
echo ""
echo "Features implemented:"
echo "- Novel-specific Quill editor with custom formats for chapters, scenes, and beats"
echo "- Provider-agnostic AI architecture with OpenAI integration"
echo "- Context handling for novel-length content"
echo "- AI assistance panel with writing continuation and other features"
echo ""
echo "Note: To use AI features, you will need to provide your own OpenAI API key in the application."
echo ""

# Start the development server
yarn dev
