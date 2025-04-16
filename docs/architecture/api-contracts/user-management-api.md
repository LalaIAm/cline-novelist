# User Management API Contract

## Overview

This document defines the contract for Novylist's user management API endpoints, which handle user profile management, settings, and preferences.

## Base URL

All endpoints are relative to the API base: `/api/users/`

## Authentication

All user management endpoints require authentication using Bearer token:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## User Management Endpoints

### User Profile

#### `GET /api/users/profile`

Retrieves the authenticated user's profile.

**Response (200 OK):**
```json
{
  "success": true,
  "profile": {
    "id": "60d21b4667d0d8992e610c84",
    "username": "username",
    "email": "user@example.com",
    "name": "User Name",
    "bio": "Writer of fantasy and science fiction...",
    "profileImage": "https://novylist.com/images/profiles/user123.jpg",
    "createdAt": "2025-01-15T12:30:45.123Z",
    "updatedAt": "2025-04-10T15:22:33.456Z",
    "preferences": {
      "genre": ["fantasy", "sci-fi"],
      "writingStyle": "descriptive",
      "aiAssistanceLevel": "moderate"
    },
    "statistics": {
      "novelCount": 3,
      "totalWordCount": 125000,
      "averageWordsPerDay": 500,
      "daysActive": 95,
      "currentStreak": 7
    },
    "subscription": {
      "tier": "standard",
      "renewalDate": "2025-12-15T00:00:00.000Z",
      "features": ["advanced-ai", "export-formats", "collaboration"]
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

#### `PUT /api/users/profile`

Updates the authenticated user's profile.

**Request Body:**
```json
{
  "name": "Updated User Name",
  "bio": "Updated bio information...",
  "profileImage": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "profile": {
    "id": "60d21b4667d0d8992e610c84",
    "username": "username",
    "email": "user@example.com",
    "name": "Updated User Name",
    "bio": "Updated bio information...",
    "profileImage": "https://novylist.com/images/profiles/user123.jpg",
    "updatedAt": "2025-04-15T16:45:22.789Z"
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
      "bio": "Bio is too long (maximum 500 characters)"
    }
  }
  ```
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### User Settings

#### `GET /api/users/settings`

Retrieves the authenticated user's settings.

**Response (200 OK):**
```json
{
  "success": true,
  "settings": {
    "theme": "dark",
    "editorPreferences": {
      "font": "Georgia",
      "fontSize": 16,
      "lineSpacing": 1.5,
      "autosaveInterval": 60,
      "showWordCount": true,
      "spellcheck": true
    },
    "notifications": {
      "email": {
        "dailyReminder": true,
        "weeklyStats": true,
        "collaborationUpdates": true,
        "marketingEmails": false
      },
      "app": {
        "goalCompletion": true,
        "commentNotifications": true,
        "aiSuggestions": true
      }
    },
    "privacy": {
      "profileVisibility": "public",
      "showActiveStatus": true,
      "shareWritingStats": true
    },
    "writingGoals": {
      "dailyWordCount": 1000,
      "weeklySessionCount": 5,
      "reminderTime": "18:00",
      "reminderDays": ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

#### `PUT /api/users/settings`

Updates the authenticated user's settings.

**Request Body:**
```json
{
  "theme": "light",
  "editorPreferences": {
    "font": "Arial",
    "fontSize": 14,
    "lineSpacing": 1.8,
    "autosaveInterval": 30
  },
  "notifications": {
    "email": {
      "dailyReminder": false
    },
    "app": {
      "aiSuggestions": false
    }
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Settings updated successfully",
  "settings": {
    "theme": "light",
    "editorPreferences": {
      "font": "Arial",
      "fontSize": 14,
      "lineSpacing": 1.8,
      "autosaveInterval": 30,
      "showWordCount": true,
      "spellcheck": true
    },
    "notifications": {
      "email": {
        "dailyReminder": false,
        "weeklyStats": true,
        "collaborationUpdates": true,
        "marketingEmails": false
      },
      "app": {
        "goalCompletion": true,
        "commentNotifications": true,
        "aiSuggestions": false
      }
    },
    "privacy": {
      "profileVisibility": "public",
      "showActiveStatus": true,
      "shareWritingStats": true
    },
    "writingGoals": {
      "dailyWordCount": 1000,
      "weeklySessionCount": 5,
      "reminderTime": "18:00",
      "reminderDays": ["monday", "tuesday", "wednesday", "thursday", "friday"]
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### User Preferences

#### `GET /api/users/preferences`

Retrieves the authenticated user's writing and AI preferences.

**Response (200 OK):**
```json
{
  "success": true,
  "preferences": {
    "genre": ["fantasy", "sci-fi"],
    "writingStyle": "descriptive",
    "aiAssistanceLevel": "moderate",
    "themesInterest": ["coming-of-age", "adventure", "politics"],
    "audienceTarget": "young-adult",
    "pacing": "medium",
    "povPreference": "third-limited",
    "stylistic": {
      "dialogueDensity": "medium",
      "descriptiveDensity": "high",
      "tonePreference": "serious",
      "sentenceLength": "mixed"
    },
    "aiFeatures": {
      "continuations": true,
      "plotSuggestions": true,
      "characterDevelopment": true,
      "editingAssistance": true,
      "dialogueAssistance": false
    }
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

#### `PUT /api/users/preferences`

Updates the authenticated user's writing and AI preferences.

**Request Body:**
```json
{
  "genre": ["fantasy", "sci-fi", "mystery"],
  "writingStyle": "concise",
  "aiAssistanceLevel": "high",
  "themesInterest": ["mystery", "adventure"],
  "pacing": "fast",
  "aiFeatures": {
    "dialogueAssistance": true
  }
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Preferences updated successfully",
  "preferences": {
    "genre": ["fantasy", "sci-fi", "mystery"],
    "writingStyle": "concise",
    "aiAssistanceLevel": "high",
    "themesInterest": ["mystery", "adventure"],
    "audienceTarget": "young-adult",
    "pacing": "fast",
    "povPreference": "third-limited",
    "stylistic": {
      "dialogueDensity": "medium",
      "descriptiveDensity": "high",
      "tonePreference": "serious",
      "sentenceLength": "mixed"
    },
    "aiFeatures": {
      "continuations": true,
      "plotSuggestions": true,
      "characterDevelopment": true,
      "editingAssistance": true,
      "dialogueAssistance": true
    }
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### Writing Statistics

#### `GET /api/users/statistics`

Retrieves the authenticated user's writing statistics.

**Query Parameters:**
- `period` (optional): Time period for statistics (e.g., "day", "week", "month", "year", "all", default: "all")
- `startDate` (optional): Start date for custom range (ISO 8601 format)
- `endDate` (optional): End date for custom range (ISO 8601 format)

**Response (200 OK):**
```json
{
  "success": true,
  "statistics": {
    "summary": {
      "totalWordCount": 125000,
      "averageWordsPerDay": 500,
      "daysActive": 95,
      "currentStreak": 7,
      "longestStreak": 21,
      "sessionsCompleted": 150,
      "averageSessionDuration": 45
    },
    "wordCountByDate": [
      {
        "date": "2025-04-14",
        "count": 1250
      },
      {
        "date": "2025-04-15",
        "count": 750
      }
    ],
    "timeSpentByDate": [
      {
        "date": "2025-04-14",
        "minutes": 120
      },
      {
        "date": "2025-04-15",
        "minutes": 90
      }
    ],
    "editRatioByDate": [
      {
        "date": "2025-04-14",
        "ratio": 0.25
      },
      {
        "date": "2025-04-15",
        "ratio": 0.15
      }
    ],
    "novelProgress": [
      {
        "novelId": "60d21b4667d0d8992e610c85",
        "title": "My Novel Title",
        "wordCount": 45000,
        "lastEdited": "2025-04-15T14:22:33.456Z",
        "progress": 0.45
      }
    ],
    "achievements": [
      {
        "id": "seven-day-streak",
        "name": "Seven Day Streak",
        "description": "Write for seven consecutive days",
        "earned": "2025-04-15T00:00:00.000Z"
      },
      {
        "id": "fifty-thousand-words",
        "name": "50K Words",
        "description": "Write a total of 50,000 words",
        "earned": "2025-03-22T00:00:00.000Z"
      }
    ]
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid parameters
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### AI Usage Statistics

#### `GET /api/users/ai-usage`

Retrieves the authenticated user's AI feature usage statistics.

**Query Parameters:**
- `period` (optional): Time period for statistics (e.g., "day", "week", "month", "year", "all", default: "month")

**Response (200 OK):**
```json
{
  "success": true,
  "aiUsage": {
    "summary": {
      "totalApiCalls": 250,
      "totalTokensUsed": 125000,
      "aiAssistancesRequested": 120,
      "aiSuggestionsAccepted": 95,
      "acceptanceRate": 0.79,
      "estimatedCost": 2.50,
      "subscriptionUsagePercentage": 62.5
    },
    "limits": {
      "tier": "standard",
      "maxApiCalls": 500,
      "maxTokensPerMonth": 200000,
      "remainingApiCalls": 250,
      "remainingTokens": 75000,
      "resetDate": "2025-05-01T00:00:00.000Z"
    },
    "usageByDate": [
      {
        "date": "2025-04-14",
        "apiCalls": 25,
        "tokensUsed": 12500
      },
      {
        "date": "2025-04-15",
        "apiCalls": 15,
        "tokensUsed": 7500
      }
    ],
    "usageByFeature": [
      {
        "feature": "continuations",
        "apiCalls": 75,
        "tokensUsed": 45000,
        "acceptanceRate": 0.80
      },
      {
        "feature": "characterDevelopment",
        "apiCalls": 50,
        "tokensUsed": 30000,
        "acceptanceRate": 0.85
      },
      {
        "feature": "plotSuggestions",
        "apiCalls": 45,
        "tokensUsed": 25000,
        "acceptanceRate": 0.75
      }
    ]
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### Subscription Management

#### `GET /api/users/subscription`

Retrieves the authenticated user's subscription information.

**Response (200 OK):**
```json
{
  "success": true,
  "subscription": {
    "tier": "standard",
    "status": "active",
    "startDate": "2025-01-15T00:00:00.000Z",
    "renewalDate": "2025-12-15T00:00:00.000Z",
    "paymentMethod": {
      "type": "card",
      "lastFour": "4242",
      "expiryDate": "12/27"
    },
    "features": [
      {
        "name": "advanced-ai",
        "description": "Access to GPT-4 powered assistance",
        "included": true
      },
      {
        "name": "export-formats",
        "description": "Export in EPUB, MOBI, PDF, and DOCX formats",
        "included": true
      },
      {
        "name": "collaboration",
        "description": "Invite up to 3 collaborators per novel",
        "included": true
      },
      {
        "name": "unlimited-novels",
        "description": "Create unlimited novels",
        "included": true
      }
    ],
    "usage": {
      "apiCalls": {
        "used": 250,
        "limit": 500,
        "percentage": 50
      },
      "tokens": {
        "used": 125000,
        "limit": 200000,
        "percentage": 62.5
      },
      "collaborators": {
        "used": 2,
        "limit": 3,
        "percentage": 66.7
      }
    },
    "billingHistory": [
      {
        "date": "2025-01-15T00:00:00.000Z",
        "amount": 99.99,
        "description": "Annual Standard Subscription",
        "status": "paid"
      }
    ]
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

#### `POST /api/users/subscription/upgrade`

Upgrades the authenticated user's subscription tier.

**Request Body:**
```json
{
  "tier": "premium",
  "paymentMethodId": "pm_1L2N3O4P5Q6R7S8T9U0V",
  "couponCode": "UPGRADE25"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription upgraded successfully",
  "subscription": {
    "tier": "premium",
    "status": "active",
    "startDate": "2025-04-15T16:55:22.789Z",
    "renewalDate": "2026-04-15T16:55:22.789Z",
    "prorated": true,
    "proratedAmount": 75.00,
    "features": [
      {
        "name": "unlimited-ai",
        "description": "Unlimited GPT-4 powered assistance",
        "included": true
      },
      {
        "name": "priority-support",
        "description": "24/7 priority customer support",
        "included": true
      },
      {
        "name": "collaboration",
        "description": "Invite up to 10 collaborators per novel",
        "included": true
      }
    ]
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data or payment failed
  ```json
  {
    "success": false,
    "message": "Payment failed",
    "errors": {
      "paymentMethod": "The payment method has expired"
    }
  }
  ```
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

#### `POST /api/users/subscription/cancel`

Cancels the authenticated user's subscription (will remain active until the current period ends).

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Subscription cancelled successfully. Your access will continue until December 15, 2025.",
  "subscription": {
    "tier": "standard",
    "status": "cancelled",
    "startDate": "2025-01-15T00:00:00.000Z",
    "endDate": "2025-12-15T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Subscription already cancelled or other issue
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### Activity History

#### `GET /api/users/activity`

Retrieves the authenticated user's recent activity.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of activities per page (default: 20)
- `type` (optional): Filter by activity type (e.g., "novel", "chapter", "character", "comment")

**Response (200 OK):**
```json
{
  "success": true,
  "activities": [
    {
      "id": "60d21b4667d0d8992e610c98",
      "type": "novel",
      "action": "updated",
      "resourceId": "60d21b4667d0d8992e610c85",
      "resourceName": "My Novel Title",
      "timestamp": "2025-04-15T15:35:12.456Z",
      "details": {
        "wordCount": 15250,
        "fieldsUpdated": ["title", "description"]
      }
    },
    {
      "id": "60d21b4667d0d8992e610c99",
      "type": "character",
      "action": "created",
      "resourceId": "60d21b4667d0d8992e610c88",
      "resourceName": "Character Name",
      "novelId": "60d21b4667d0d8992e610c85",
      "novelName": "My Novel Title",
      "timestamp": "2025-04-15T16:00:12.345Z"
    },
    {
      "id": "60d21b4667d0d8992e610c97",
      "type": "chapter",
      "action": "edited",
      "resourceId": "60d21b4667d0d8992e610c87",
      "resourceName": "Chapter 1: The Beginning",
      "novelId": "60d21b4667d0d8992e610c85",
      "novelName": "My Novel Title",
      "timestamp": "2025-04-15T15:50:15.456Z",
      "details": {
        "wordsDelta": 25
      }
    }
  ],
  "pagination": {
    "totalActivities": 50,
    "totalPages": 3,
    "currentPage": 1,
    "limit": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### Notifications

#### `GET /api/users/notifications`

Retrieves the authenticated user's notifications.

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of notifications per page (default: 20)
- `unreadOnly` (optional): Filter to only unread notifications (default: false)

**Response (200 OK):**
```json
{
  "success": true,
  "notifications": [
    {
      "id": "60d21b4667d0d8992e610c9a",
      "type": "comment",
      "message": "User2 commented on your character 'Character Name'",
      "resourceType": "character",
      "resourceId": "60d21b4667d0d8992e610c88",
      "novelId": "60d21b4667d0d8992e610c85",
      "timestamp": "2025-04-15T17:05:33.456Z",
      "read": false,
      "actionUrl": "/novels/60d21b4667d0d8992e610c85/characters/60d21b4667d0d8992e610c88"
    },
    {
      "id": "60d21b4667d0d8992e610c9b",
      "type": "collaboration",
      "message": "User3 accepted your invitation to collaborate on 'My Novel Title'",
      "resourceType": "novel",
      "resourceId": "60d21b4667d0d8992e610c85",
      "timestamp": "2025-04-15T16:45:22.789Z",
      "read": true,
      "actionUrl": "/novels/60d21b4667d0d8992e610c85/settings/collaborators"
    },
    {
      "id": "60d21b4667d0d8992e610c9c",
      "type": "goal",
      "message": "Congratulations! You've achieved your daily writing goal of 1000 words",
      "timestamp": "2025-04-14T23:59:59.999Z",
      "read": true,
      "actionUrl": "/stats"
    }
  ],
  "pagination": {
    "totalNotifications": 35,
    "totalPages": 2,
    "currentPage": 1,
    "limit": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "unreadCount": 5
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

#### `PUT /api/users/notifications/:notificationId/read`

Marks a notification as read.

**URL Parameters:**
- `notificationId`: The ID of the notification to mark as read

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `404 Not Found`: Notification not found
- `500 Internal Server Error`: Server error

#### `PUT /api/users/notifications/read-all`

Marks all notifications as read.

**Response (200 OK):**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "count": 5
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing the problem",
  "errors": {
    "field": "Specific field error message"
  }
}
```

### Common Error Codes

- `400 Bad Request`: Invalid input data
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Not allowed to access the resource
- `404 Not Found`: Resource not found
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Implementation Notes

- User profile management includes customizable fields for writing preferences and profile information
- Settings API allows for granular control of editor preferences, notifications, privacy, and writing goals
- Statistics API provides detailed metrics on writing progress and habits
- AI usage tracking provides transparency on feature usage and subscription limits
- Subscription management handles tier changes, billing, and feature access
- Activity history tracks all user actions within the platform
- Notification system keeps users informed of relevant events
