# AI Assistance API Contract

**Title**: Novylist AI Assistance API Specification  
**Description**: API endpoints for AI-assisted writing features  
**Version**: 1.0  
**Last Updated**: 4/13/2025  

This document defines the API contract for AI-assisted writing features in Novylist, specifying endpoints, request/response formats, and error handling.

## Base URL

```
/api/v1/ai
```

## Authentication

All AI assistance endpoints require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer {jwt_token}
```

## Endpoints

### 1. Get Writing Continuation

Generates a continuation for the user's current writing based on the provided context.

**Endpoint**: `POST /writing/continuation`

**Request Body**:
```json
{
  "novelId": "string",
  "chapterId": "string",
  "recentText": "string",
  "writingStyle": "string",
  "genre": "string",
  "pointOfView": "string",
  "setting": "string",
  "narrativeFocus": "string",
  "characterInfo": "string",
  "recentPlotPoints": "string",
  "wordCount": "number"
}
```

**Required Fields**:
- `novelId`: ID of the novel
- `recentText`: The last few paragraphs of text (typically 200-500 words)

**Optional Fields**:
- `chapterId`: ID of the chapter (if continuation is for a specific chapter)
- `writingStyle`: Description of the author's writing style
- `genre`: Novel genre
- `pointOfView`: Narrative point of view
- `setting`: Current setting description
- `narrativeFocus`: Current narrative focus
- `characterInfo`: Information about relevant characters
- `recentPlotPoints`: Recent plot developments
- `wordCount`: Desired word count for continuation (default: 200)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "continuation": "string",
    "tokenUsage": {
      "prompt": "number",
      "completion": "number",
      "total": "number"
    },
    "processingTime": "number"
  }
}
```

**Error Responses**:

- `401 Unauthorized`: Invalid or missing authentication token
- `400 Bad Request`: Missing required fields or invalid parameters
- `403 Forbidden`: User doesn't have access to the specified novel
- `500 Internal Server Error`: Server or AI service error

### 2. Character Development Suggestions

Provides suggestions for character development based on the current character information.

**Endpoint**: `POST /character/suggestions`

**Request Body**:
```json
{
  "novelId": "string",
  "characterId": "string",
  "characterInfo": {
    "name": "string",
    "description": "string",
    "background": "string", 
    "personality": "string",
    "goals": "string",
    "relationships": "array",
    "development": "string"
  },
  "suggestionType": "string",
  "genre": "string",
  "count": "number"
}
```

**Required Fields**:
- `novelId`: ID of the novel
- `characterId`: ID of the character
- `characterInfo`: Object containing character information

**Optional Fields**:
- `suggestionType`: Type of suggestions (personality, background, arc, dialogue, conflict)
- `genre`: Novel genre for context
- `count`: Number of suggestions to return (default: 3)

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "suggestions": [
      {
        "type": "string",
        "content": "string",
        "reasoning": "string"
      }
    ],
    "tokenUsage": {
      "prompt": "number",
      "completion": "number",
      "total": "number"
    },
    "processingTime": "number"
  }
}
```

**Error Responses**: Same as above

### 3. Plot Development Assistance

Provides plot development assistance, including identifying plot holes, suggesting plot developments, or analyzing existing plot structure.

**Endpoint**: `POST /plot/analysis`

**Request Body**:
```json
{
  "novelId": "string",
  "plotElements": "array",
  "analysisType": "string",
  "currentContent": "string",
  "genre": "string"
}
```

**Required Fields**:
- `novelId`: ID of the novel
- `analysisType`: Type of analysis (holes, suggestions, structure, pacing)

**Optional Fields**:
- `plotElements`: Array of existing plot elements
- `currentContent`: Summary or excerpt of current content
- `genre`: Novel genre

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "analysis": {
      "type": "string",
      "findings": "array",
      "suggestions": "array"
    },
    "tokenUsage": {
      "prompt": "number",
      "completion": "number",
      "total": "number"
    },
    "processingTime": "number"
  }
}
```

**Error Responses**: Same as above

### 4. Dialogue Enhancement

Provides suggestions for improving or generating dialogue between characters.

**Endpoint**: `POST /dialogue/enhance`

**Request Body**:
```json
{
  "novelId": "string",
  "characters": "array",
  "existingDialogue": "string",
  "context": "string",
  "tone": "string",
  "goal": "string"
}
```

**Required Fields**:
- `novelId`: ID of the novel
- `characters`: Array of characters involved in the dialogue

**Optional Fields**:
- `existingDialogue`: Existing dialogue to enhance
- `context`: Scene context
- `tone`: Desired tone for the dialogue
- `goal`: Goal of the conversation

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "enhancedDialogue": "string",
    "alternativeVersions": "array",
    "tokenUsage": {
      "prompt": "number",
      "completion": "number",
      "total": "number"
    },
    "processingTime": "number"
  }
}
```

**Error Responses**: Same as above

### 5. AI Settings Management

Retrieves or updates the user's AI assistance settings.

**Endpoint**: `GET /settings`

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "aiAssistanceLevel": "string",
    "preferredModel": "string",
    "genres": "array",
    "writingStyle": "string",
    "nudgingFrequency": "string",
    "customPrompts": "array"
  }
}
```

**Endpoint**: `PUT /settings`

**Request Body**:
```json
{
  "aiAssistanceLevel": "string",
  "preferredModel": "string",
  "genres": "array",
  "writingStyle": "string",
  "nudgingFrequency": "string",
  "customPrompts": "array"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "updated": true,
    "settings": {
      // Updated settings object
    }
  }
}
```

## Standard Error Response Format

All API errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Authentication required or invalid token |
| `INVALID_REQUEST` | Invalid request parameters |
| `RESOURCE_NOT_FOUND` | The requested resource was not found |
| `PERMISSION_DENIED` | User doesn't have permission for the operation |
| `AI_SERVICE_ERROR` | Error from the AI service provider |
| `RATE_LIMIT_EXCEEDED` | User has exceeded their rate limit |
| `INTERNAL_ERROR` | Internal server error |

## Rate Limiting

AI assistance endpoints are subject to rate limiting based on user tier:

- Free tier: 20 requests per day
- Standard tier: 100 requests per day
- Premium tier: Unlimited requests

Rate limit headers are included in responses:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1618324800
```

## Performance Requirements

- Target response time: < 500ms for interactive features
- Maximum response time: < 3000ms for any AI operation
- Availability: 99.9% uptime

## Data Privacy Considerations

- User content sent to the OpenAI API is not stored by OpenAI beyond the request
- All requests are logged for debugging but content is truncated
- User can opt out of having their data used for AI model improvement

## Implementation Notes

- Server-side implementation will use a facade pattern to abstract AI provider details
- Caching will be utilized for common operations to improve performance
- Automatic retry with exponential backoff for transient errors
- Circuit breaker pattern will be implemented for fault tolerance
