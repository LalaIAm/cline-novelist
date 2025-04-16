# Novel Management API Contract

## Overview

This document defines the contract for Novylist's novel management API endpoints, which handle the creation, retrieval, updating, and deletion of novels and their related components such as chapters, scenes, characters, and plot elements.

## Base URL

All endpoints are relative to the API base: `/api/novels/`

## Authentication

All novel management endpoints require authentication using Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Novel Management Endpoints

### Novel CRUD Operations

#### `POST /api/novels`

Creates a new novel for the authenticated user.

**Request Body:**
```json
{
  "title": "My Novel Title",
  "description": "A brief description of the novel",
  "genre": ["fantasy", "adventure"],
  "status": "draft"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Novel created successfully",
  "novel": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "My Novel Title",
    "description": "A brief description of the novel",
    "genre": ["fantasy", "adventure"],
    "status": "draft",
    "userId": "60d21b4667d0d8992e610c84",
    "createdAt": "2025-04-15T15:30:45.123Z",
    "updatedAt": "2025-04-15T15:30:45.123Z",
    "chapters": [],
    "characters": [],
    "plotElements": [],
    "versionHistory": [
      {
        "id": "60d21b4667d0d8992e610c86",
        "timestamp": "2025-04-15T15:30:45.123Z",
        "changeDescription": "Initial creation"
      }
    ]
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
  ```json
  {
    "success": false,
    "message": "Validation error",
    "errors": {
      "title": "Title is required"
    }
  }
  ```
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

#### `GET /api/novels`

Retrieves all novels for the authenticated user.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of novels per page (default: 10)
- `status` (optional): Filter by novel status (e.g., "draft", "completed")
- `genre` (optional): Filter by genre
- `sort` (optional): Sort field (e.g., "updatedAt", "title")
- `order` (optional): Sort order ("asc" or "desc", default: "desc")

**Response (200 OK):**
```json
{
  "success": true,
  "novels": [
    {
      "id": "60d21b4667d0d8992e610c85",
      "title": "My Novel Title",
      "description": "A brief description of the novel",
      "genre": ["fantasy", "adventure"],
      "status": "draft",
      "createdAt": "2025-04-15T15:30:45.123Z",
      "updatedAt": "2025-04-15T15:30:45.123Z",
      "wordCount": 0,
      "chapterCount": 0,
      "characterCount": 0
    }
  ],
  "pagination": {
    "totalNovels": 1,
    "totalPages": 1,
    "currentPage": 1,
    "limit": 10,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

#### `GET /api/novels/:id`

Retrieves a specific novel by ID.

**URL Parameters:**
- `id`: The ID of the novel to retrieve

**Query Parameters:**
- `includeChapters` (optional): Whether to include chapter data (default: false)
- `includeCharacters` (optional): Whether to include character data (default: false)
- `includePlotElements` (optional): Whether to include plot element data (default: false)
- `includeVersionHistory` (optional): Whether to include version history data (default: false)

**Response (200 OK):**
```json
{
  "success": true,
  "novel": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "My Novel Title",
    "description": "A brief description of the novel",
    "genre": ["fantasy", "adventure"],
    "status": "draft",
    "userId": "60d21b4667d0d8992e610c84",
    "createdAt": "2025-04-15T15:30:45.123Z",
    "updatedAt": "2025-04-15T15:30:45.123Z",
    "wordCount": 15000,
    "chapters": [
      {
        "id": "60d21b4667d0d8992e610c87",
        "title": "Chapter 1: The Beginning",
        "order": 1
      }
    ],
    "characters": [
      {
        "id": "60d21b4667d0d8992e610c88",
        "name": "Protagonist Name"
      }
    ],
    "plotElements": [
      {
        "id": "60d21b4667d0d8992e610c89",
        "title": "The Inciting Incident",
        "type": "beat"
      }
    ],
    "versionHistory": [
      {
        "id": "60d21b4667d0d8992e610c86",
        "timestamp": "2025-04-15T15:30:45.123Z",
        "changeDescription": "Initial creation"
      }
    ]
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to access this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

#### `PUT /api/novels/:id`

Updates a specific novel by ID.

**URL Parameters:**
- `id`: The ID of the novel to update

**Request Body:**
```json
{
  "title": "Updated Novel Title",
  "description": "An updated description of the novel",
  "genre": ["fantasy", "adventure", "mystery"],
  "status": "in-progress"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Novel updated successfully",
  "novel": {
    "id": "60d21b4667d0d8992e610c85",
    "title": "Updated Novel Title",
    "description": "An updated description of the novel",
    "genre": ["fantasy", "adventure", "mystery"],
    "status": "in-progress",
    "userId": "60d21b4667d0d8992e610c84",
    "createdAt": "2025-04-15T15:30:45.123Z",
    "updatedAt": "2025-04-15T15:35:12.456Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to update this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

#### `DELETE /api/novels/:id`

Deletes a specific novel by ID.

**URL Parameters:**
- `id`: The ID of the novel to delete

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Novel deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to delete this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

### Chapter Management

#### `POST /api/novels/:novelId/chapters`

Creates a new chapter for a specific novel.

**URL Parameters:**
- `novelId`: The ID of the novel to add a chapter to

**Request Body:**
```json
{
  "title": "Chapter 1: The Beginning",
  "order": 1,
  "content": "<p>The chapter content in rich text format...</p>"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Chapter created successfully",
  "chapter": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "Chapter 1: The Beginning",
    "order": 1,
    "content": "<p>The chapter content in rich text format...</p>",
    "novelId": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-15T15:40:22.789Z",
    "updatedAt": "2025-04-15T15:40:22.789Z",
    "wordCount": 250,
    "scenes": []
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to add chapters to this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

#### `GET /api/novels/:novelId/chapters`

Retrieves all chapters for a specific novel.

**URL Parameters:**
- `novelId`: The ID of the novel to retrieve chapters for

**Query Parameters:**
- `includeContent` (optional): Whether to include chapter content (default: false)
- `includeScenes` (optional): Whether to include scene data (default: false)

**Response (200 OK):**
```json
{
  "success": true,
  "chapters": [
    {
      "id": "60d21b4667d0d8992e610c87",
      "title": "Chapter 1: The Beginning",
      "order": 1,
      "novelId": "60d21b4667d0d8992e610c85",
      "createdAt": "2025-04-15T15:40:22.789Z",
      "updatedAt": "2025-04-15T15:40:22.789Z",
      "wordCount": 250,
      "sceneCount": 3
    },
    {
      "id": "60d21b4667d0d8992e610c90",
      "title": "Chapter 2: The Journey",
      "order": 2,
      "novelId": "60d21b4667d0d8992e610c85",
      "createdAt": "2025-04-15T15:45:33.123Z",
      "updatedAt": "2025-04-15T15:45:33.123Z",
      "wordCount": 320,
      "sceneCount": 2
    }
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to access this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

#### `GET /api/novels/:novelId/chapters/:chapterId`

Retrieves a specific chapter by ID.

**URL Parameters:**
- `novelId`: The ID of the novel the chapter belongs to
- `chapterId`: The ID of the chapter to retrieve

**Response (200 OK):**
```json
{
  "success": true,
  "chapter": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "Chapter 1: The Beginning",
    "order": 1,
    "content": "<p>The chapter content in rich text format...</p>",
    "novelId": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-15T15:40:22.789Z",
    "updatedAt": "2025-04-15T15:40:22.789Z",
    "wordCount": 250,
    "scenes": [
      {
        "id": "60d21b4667d0d8992e610c91",
        "title": "Scene 1",
        "order": 1
      }
    ]
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to access this chapter
- `404 Not Found`: Novel or chapter not found
- `500 Internal Server Error`: Server error

#### `PUT /api/novels/:novelId/chapters/:chapterId`

Updates a specific chapter by ID.

**URL Parameters:**
- `novelId`: The ID of the novel the chapter belongs to
- `chapterId`: The ID of the chapter to update

**Request Body:**
```json
{
  "title": "Updated Chapter Title",
  "order": 2,
  "content": "<p>Updated chapter content in rich text format...</p>"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Chapter updated successfully",
  "chapter": {
    "id": "60d21b4667d0d8992e610c87",
    "title": "Updated Chapter Title",
    "order": 2,
    "content": "<p>Updated chapter content in rich text format...</p>",
    "novelId": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-15T15:40:22.789Z",
    "updatedAt": "2025-04-15T15:50:15.456Z",
    "wordCount": 275
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to update this chapter
- `404 Not Found`: Novel or chapter not found
- `500 Internal Server Error`: Server error

#### `DELETE /api/novels/:novelId/chapters/:chapterId`

Deletes a specific chapter by ID.

**URL Parameters:**
- `novelId`: The ID of the novel the chapter belongs to
- `chapterId`: The ID of the chapter to delete

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Chapter deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to delete this chapter
- `404 Not Found`: Novel or chapter not found
- `500 Internal Server Error`: Server error

### Scene Management

#### `POST /api/novels/:novelId/chapters/:chapterId/scenes`

Creates a new scene for a specific chapter.

**URL Parameters:**
- `novelId`: The ID of the novel the chapter belongs to
- `chapterId`: The ID of the chapter to add a scene to

**Request Body:**
```json
{
  "title": "Scene 1",
  "order": 1,
  "content": "<p>The scene content in rich text format...</p>",
  "notes": "Scene notes for the author..."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Scene created successfully",
  "scene": {
    "id": "60d21b4667d0d8992e610c91",
    "title": "Scene 1",
    "order": 1,
    "content": "<p>The scene content in rich text format...</p>",
    "notes": "Scene notes for the author...",
    "chapterId": "60d21b4667d0d8992e610c87",
    "novelId": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-15T15:55:03.789Z",
    "updatedAt": "2025-04-15T15:55:03.789Z",
    "wordCount": 120,
    "beats": []
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to add scenes to this chapter
- `404 Not Found`: Novel or chapter not found
- `500 Internal Server Error`: Server error

#### Additional Scene Endpoints

Similar to chapter management, the following scene endpoints are available:

- `GET /api/novels/:novelId/chapters/:chapterId/scenes` - Get all scenes for a chapter
- `GET /api/novels/:novelId/chapters/:chapterId/scenes/:sceneId` - Get a specific scene
- `PUT /api/novels/:novelId/chapters/:chapterId/scenes/:sceneId` - Update a scene
- `DELETE /api/novels/:novelId/chapters/:chapterId/scenes/:sceneId` - Delete a scene

### Character Management

#### `POST /api/novels/:novelId/characters`

Creates a new character for a specific novel.

**URL Parameters:**
- `novelId`: The ID of the novel to add a character to

**Request Body:**
```json
{
  "name": "Character Name",
  "description": "Character description...",
  "role": "protagonist",
  "attributes": {
    "physical": {
      "age": 25,
      "height": "6'0\"",
      "eyeColor": "blue",
      "hairColor": "brown"
    },
    "personality": {
      "traits": ["brave", "intelligent", "stubborn"],
      "strengths": ["quick thinking", "loyalty"],
      "weaknesses": ["overconfidence", "impatience"]
    },
    "background": {
      "birthplace": "Small village",
      "occupation": "Apprentice wizard",
      "education": "Self-taught"
    }
  }
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Character created successfully",
  "character": {
    "id": "60d21b4667d0d8992e610c88",
    "name": "Character Name",
    "description": "Character description...",
    "role": "protagonist",
    "attributes": {
      "physical": {
        "age": 25,
        "height": "6'0\"",
        "eyeColor": "blue",
        "hairColor": "brown"
      },
      "personality": {
        "traits": ["brave", "intelligent", "stubborn"],
        "strengths": ["quick thinking", "loyalty"],
        "weaknesses": ["overconfidence", "impatience"]
      },
      "background": {
        "birthplace": "Small village",
        "occupation": "Apprentice wizard",
        "education": "Self-taught"
      }
    },
    "novelId": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-15T16:00:12.345Z",
    "updatedAt": "2025-04-15T16:00:12.345Z",
    "relationships": []
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to add characters to this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

#### Additional Character Endpoints

The following character endpoints are available:

- `GET /api/novels/:novelId/characters` - Get all characters for a novel
- `GET /api/novels/:novelId/characters/:characterId` - Get a specific character
- `PUT /api/novels/:novelId/characters/:characterId` - Update a character
- `DELETE /api/novels/:novelId/characters/:characterId` - Delete a character

### Character Relationship Management

#### `POST /api/novels/:novelId/relationships`

Creates a new relationship between two characters in a novel.

**URL Parameters:**
- `novelId`: The ID of the novel

**Request Body:**
```json
{
  "character1Id": "60d21b4667d0d8992e610c88",
  "character2Id": "60d21b4667d0d8992e610c92",
  "relationshipType": "mentor",
  "description": "Character 1 is the mentor of Character 2",
  "strength": 8
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Relationship created successfully",
  "relationship": {
    "id": "60d21b4667d0d8992e610c93",
    "character1Id": "60d21b4667d0d8992e610c88",
    "character2Id": "60d21b4667d0d8992e610c92",
    "relationshipType": "mentor",
    "description": "Character 1 is the mentor of Character 2",
    "strength": 8,
    "novelId": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-15T16:05:22.789Z",
    "updatedAt": "2025-04-15T16:05:22.789Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to add relationships to this novel
- `404 Not Found`: Novel or characters not found
- `500 Internal Server Error`: Server error

#### Additional Relationship Endpoints

The following relationship endpoints are available:

- `GET /api/novels/:novelId/relationships` - Get all relationships for a novel
- `GET /api/novels/:novelId/relationships/:relationshipId` - Get a specific relationship
- `PUT /api/novels/:novelId/relationships/:relationshipId` - Update a relationship
- `DELETE /api/novels/:novelId/relationships/:relationshipId` - Delete a relationship
- `GET /api/novels/:novelId/characters/:characterId/relationships` - Get all relationships for a character

### Plot Element Management

#### `POST /api/novels/:novelId/plot-elements`

Creates a new plot element for a specific novel.

**URL Parameters:**
- `novelId`: The ID of the novel to add a plot element to

**Request Body:**
```json
{
  "title": "The Inciting Incident",
  "description": "The protagonist discovers a mysterious artifact...",
  "type": "beat",
  "position": {
    "timeline": 1,
    "structure": "act1-incident",
    "importance": 9
  },
  "relatedCharacters": ["60d21b4667d0d8992e610c88", "60d21b4667d0d8992e610c92"]
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Plot element created successfully",
  "plotElement": {
    "id": "60d21b4667d0d8992e610c89",
    "title": "The Inciting Incident",
    "description": "The protagonist discovers a mysterious artifact...",
    "type": "beat",
    "position": {
      "timeline": 1,
      "structure": "act1-incident",
      "importance": 9
    },
    "relatedCharacters": ["60d21b4667d0d8992e610c88", "60d21b4667d0d8992e610c92"],
    "novelId": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-15T16:10:33.456Z",
    "updatedAt": "2025-04-15T16:10:33.456Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to add plot elements to this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

#### Additional Plot Element Endpoints

The following plot element endpoints are available:

- `GET /api/novels/:novelId/plot-elements` - Get all plot elements for a novel
- `GET /api/novels/:novelId/plot-elements/:plotElementId` - Get a specific plot element
- `PUT /api/novels/:novelId/plot-elements/:plotElementId` - Update a plot element
- `DELETE /api/novels/:novelId/plot-elements/:plotElementId` - Delete a plot element

### Version Management

#### `POST /api/novels/:novelId/versions`

Creates a new version of a novel (snapshot).

**URL Parameters:**
- `novelId`: The ID of the novel to create a version for

**Request Body:**
```json
{
  "name": "Draft 1.0",
  "description": "First complete draft",
  "isCheckpoint": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Version created successfully",
  "version": {
    "id": "60d21b4667d0d8992e610c94",
    "name": "Draft 1.0",
    "description": "First complete draft",
    "isCheckpoint": true,
    "novelId": "60d21b4667d0d8992e610c85",
    "parentVersionId": null,
    "createdAt": "2025-04-15T16:15:45.789Z",
    "branchName": null
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to create versions for this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

#### `POST /api/novels/:novelId/versions/:versionId/branch`

Creates a new branch from an existing version.

**URL Parameters:**
- `novelId`: The ID of the novel
- `versionId`: The ID of the version to branch from

**Request Body:**
```json
{
  "name": "Alternative Ending",
  "description": "Exploring a different resolution",
  "branchName": "alt-ending"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Branch created successfully",
  "version": {
    "id": "60d21b4667d0d8992e610c95",
    "name": "Alternative Ending",
    "description": "Exploring a different resolution",
    "isCheckpoint": true,
    "novelId": "60d21b4667d0d8992e610c85",
    "parentVersionId": "60d21b4667d0d8992e610c94",
    "createdAt": "2025-04-15T16:20:11.123Z",
    "branchName": "alt-ending"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to create branches for this novel
- `404 Not Found`: Novel or version not found
- `500 Internal Server Error`: Server error

#### Additional Version Endpoints

The following version endpoints are available:

- `GET /api/novels/:novelId/versions` - Get all versions for a novel
- `GET /api/novels/:novelId/versions/:versionId` - Get a specific version
- `GET /api/novels/:novelId/versions/:versionId/compare/:compareToId` - Compare two versions
- `POST /api/novels/:novelId/versions/:versionId/restore` - Restore to a specific version

### Comment Management

#### `POST /api/novels/:novelId/comments`

Adds a comment to any element in the novel (polymorphic reference).

**URL Parameters:**
- `novelId`: The ID of the novel

**Request Body:**
```json
{
  "content": "This character needs more development",
  "referenceType": "character",
  "referenceId": "60d21b4667d0d8992e610c88"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Comment added successfully",
  "comment": {
    "id": "60d21b4667d0d8992e610c96",
    "content": "This character needs more development",
    "referenceType": "character",
    "referenceId": "60d21b4667d0d8992e610c88",
    "userId": "60d21b4667d0d8992e610c84",
    "novelId": "60d21b4667d0d8992e610c85",
    "createdAt": "2025-04-15T16:25:33.456Z",
    "updatedAt": "2025-04-15T16:25:33.456Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to add comments to this novel
- `404 Not Found`: Novel or reference not found
- `500 Internal Server Error`: Server error

#### Additional Comment Endpoints

The following comment endpoints are available:

- `GET /api/novels/:novelId/comments` - Get all comments for a novel
- `GET /api/novels/:novelId/comments/:commentId` - Get a specific comment
- `PUT /api/novels/:novelId/comments/:commentId` - Update a comment
- `DELETE /api/novels/:novelId/comments/:commentId` - Delete a comment
- `GET /api/novels/:novelId/:referenceType/:referenceId/comments` - Get all comments for a specific reference

### Collaboration Management

#### `POST /api/novels/:novelId/collaborators`

Adds a collaborator to a novel.

**URL Parameters:**
- `novelId`: The ID of the novel

**Request Body:**
```json
{
  "email": "collaborator@example.com",
  "role": "editor"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Collaborator added successfully",
  "collaborator": {
    "userId": "60d21b4667d0d8992e610c97",
    "email": "collaborator@example.com",
    "username": "collaborator",
    "role": "editor",
    "addedAt": "2025-04-15T16:30:45.789Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data or user not found
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to add collaborators to this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error

#### Additional Collaboration Endpoints

The following collaboration endpoints are available:

- `GET /api/novels/:novelId/collaborators` - Get all collaborators for a novel
- `PUT /api/novels/:novelId/collaborators/:userId` - Update a collaborator's role
- `DELETE /api/novels/:novelId/collaborators/:userId` - Remove a collaborator

### Export Endpoints

#### `POST /api/novels/:novelId/export`

Exports a novel in the specified format.

**URL Parameters:**
- `novelId`: The ID of the novel to export

**Request Body:**
```json
{
  "format": "pdf",
  "options": {
    "includeChapters": true,
    "includeNotes": false,
    "includeFrontMatter": true,
    "includeBackMatter": false,
    "customTemplate": "standard"
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Export successful",
  "exportUrl": "https://novylist.com/exports/60d21b4667d0d8992e610c85.pdf",
  "expiresAt": "2025-04-16T16:35:22.123Z"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `403 Forbidden`: Not authorized to export this novel
- `404 Not Found`: Novel not found
- `500 Internal Server Error`: Server error
