# Authentication API Contract

## Overview

This document defines the contract for Novylist's authentication API endpoints, which handle user registration, login, multi-factor authentication, social authentication, and password management.

## Base URL

All endpoints are relative to the API base: `/api/auth/`

## Authentication Endpoints

### User Registration

#### `POST /api/auth/register`

Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "password123!",
  "confirmPassword": "password123!"
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully. Please verify your email.",
  "userId": "60d21b4667d0d8992e610c85"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid input data
  ```json
  {
    "success": false,
    "message": "Validation error",
    "errors": {
      "email": "Email is already in use",
      "password": "Password must be at least 8 characters with 1 letter, 1 number, and 1 special character"
    }
  }
  ```
- `500 Internal Server Error`: Server error

**Validation Rules:**
- Email must be a valid format and unique
- Username must be 3-30 characters and unique
- Password must be at least 8 characters with at least 1 letter, 1 number, and 1 special character
- Confirm password must match password

### Email Verification

#### `POST /api/auth/verify-email`

Verifies a user's email address using a token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Email verified successfully. You can now log in."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired token
  ```json
  {
    "success": false,
    "message": "Invalid or expired verification token."
  }
  ```
- `500 Internal Server Error`: Server error

#### `POST /api/auth/resend-verification`

Resends the email verification token.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Verification email has been resent."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid email or already verified
  ```json
  {
    "success": false,
    "message": "Email not found or already verified."
  }
  ```
- `500 Internal Server Error`: Server error

### User Login

#### `POST /api/auth/login`

Authenticates a user and returns JWT tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "username",
    "email": "user@example.com",
    "profile": {
      "name": "User Name",
      "preferences": {
        "genre": ["fantasy", "sci-fi"],
        "writingStyle": "descriptive",
        "aiAssistanceLevel": "moderate"
      }
    },
    "mfaEnabled": false
  },
  "requiresMfa": false
}
```

**MFA Required Response (200 OK):**
```json
{
  "success": true,
  "message": "MFA verification required",
  "requiresMfa": true,
  "mfaMethods": ["app", "email"],
  "mfaToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid credentials
  ```json
  {
    "success": false,
    "message": "Invalid email or password."
  }
  ```
- `403 Forbidden`: Email not verified
  ```json
  {
    "success": false,
    "message": "Email not verified. Please check your email for verification instructions."
  }
  ```
- `500 Internal Server Error`: Server error

### Multi-Factor Authentication

#### `POST /api/auth/mfa/verify`

Verifies an MFA code after successful password authentication.

**Request Body:**
```json
{
  "mfaToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "code": "123456",
  "method": "app"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "MFA verification successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "60d21b4667d0d8992e610c85",
    "username": "username",
    "email": "user@example.com",
    "profile": {
      "name": "User Name",
      "preferences": {
        "genre": ["fantasy", "sci-fi"],
        "writingStyle": "descriptive",
        "aiAssistanceLevel": "moderate"
      }
    },
    "mfaEnabled": true
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid code
  ```json
  {
    "success": false,
    "message": "Invalid MFA code."
  }
  ```
- `401 Unauthorized`: Invalid or expired MFA token
  ```json
  {
    "success": false,
    "message": "Invalid or expired MFA token."
  }
  ```
- `500 Internal Server Error`: Server error

#### `POST /api/auth/mfa/setup`

Sets up multi-factor authentication for a user.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "method": "app"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "MFA setup initialized",
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg...",
  "setupToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `400 Bad Request`: Invalid method
  ```json
  {
    "success": false,
    "message": "Invalid MFA method."
  }
  ```
- `500 Internal Server Error`: Server error

#### `POST /api/auth/mfa/verify-setup`

Verifies a setup MFA code and completes MFA setup.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "setupToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "code": "123456"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "MFA setup completed successfully",
  "recoveryCodes": [
    "ABCD-1234-EFGH-5678",
    "IJKL-9012-MNOP-3456",
    "QRST-7890-UVWX-1234"
  ]
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `400 Bad Request`: Invalid code
  ```json
  {
    "success": false,
    "message": "Invalid MFA code."
  }
  ```
- `500 Internal Server Error`: Server error

#### `POST /api/auth/mfa/disable`

Disables MFA for the authenticated user.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "password": "password123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "MFA disabled successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `400 Bad Request`: Invalid password
  ```json
  {
    "success": false,
    "message": "Invalid password."
  }
  ```
- `500 Internal Server Error`: Server error

### Password Management

#### `POST /api/auth/password-reset/request`

Requests a password reset for a user.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "If an account exists with that email, a password reset link has been sent."
}
```

**Error Responses:**
- `500 Internal Server Error`: Server error

#### `POST /api/auth/password-reset/verify`

Verifies a password reset token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token is valid",
  "email": "user@example.com"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired token
  ```json
  {
    "success": false,
    "message": "Invalid or expired reset token."
  }
  ```
- `500 Internal Server Error`: Server error

#### `POST /api/auth/password-reset/confirm`

Resets a user's password using a token.

**Request Body:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "password": "newPassword123!",
  "confirmPassword": "newPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password reset successfully. You can now log in with your new password."
}
```

**Error Responses:**
- `400 Bad Request`: Invalid or expired token, or password validation failed
  ```json
  {
    "success": false,
    "message": "Invalid or expired reset token."
  }
  ```
  ```json
  {
    "success": false,
    "message": "Validation error",
    "errors": {
      "password": "Password must be at least 8 characters with 1 letter, 1 number, and 1 special character",
      "confirmPassword": "Passwords do not match"
    }
  }
  ```
- `500 Internal Server Error`: Server error

#### `POST /api/auth/password/change`

Changes the password for an authenticated user.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "currentPassword": "password123!",
  "newPassword": "newPassword123!",
  "confirmPassword": "newPassword123!"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Password changed successfully."
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `400 Bad Request`: Invalid current password or validation failed
  ```json
  {
    "success": false,
    "message": "Current password is incorrect."
  }
  ```
  ```json
  {
    "success": false,
    "message": "Validation error",
    "errors": {
      "newPassword": "Password must be at least 8 characters with 1 letter, 1 number, and 1 special character",
      "confirmPassword": "Passwords do not match"
    }
  }
  ```
- `500 Internal Server Error`: Server error

### Session Management

#### `POST /api/auth/refresh`

Refreshes an access token using a refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or expired refresh token
  ```json
  {
    "success": false,
    "message": "Invalid or expired refresh token."
  }
  ```
- `500 Internal Server Error`: Server error

#### `POST /api/auth/logout`

Logs out a user and invalidates their refresh token.

**Request Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

### Social Authentication

#### `GET /api/auth/google`

Initiates Google OAuth authentication.

**Response:**

Redirects to Google authentication page.

#### `GET /api/auth/google/callback`

Callback endpoint for Google OAuth authentication.

**Response:**

Redirects to the frontend with authentication tokens, or to an error page if authentication fails.

#### `GET /api/auth/linkedin`

Initiates LinkedIn OAuth authentication.

**Response:**

Redirects to LinkedIn authentication page.

#### `GET /api/auth/linkedin/callback`

Callback endpoint for LinkedIn OAuth authentication.

**Response:**

Redirects to the frontend with authentication tokens, or to an error page if authentication fails.

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

## Security Considerations

1. **Password Requirements**
   - Minimum 8 characters
   - At least 1 letter, 1 number, and 1 special character
   - Passwords are hashed using bcrypt before storage

2. **Token Security**
   - JWT tokens with appropriate expiration times
   - Access tokens: 15 minutes
   - Refresh tokens: 7 days
   - Password reset tokens: 1 hour
   - Email verification tokens: 24 hours

3. **Rate Limiting**
   - Login: 5 attempts per minute
   - Password reset: 3 attempts per hour
   - Registration: 3 attempts per hour

4. **HTTPS Only**
   - All API endpoints require HTTPS

5. **CSRF Protection**
   - CSRF tokens required for authentication-related endpoints

## Implementation Notes

- Authentication implementation uses JWT for stateless authentication
- Refresh token rotation is implemented for enhanced security
- MFA implementation supports multiple methods (app, email, SMS)
- Social authentication implemented using Passport.js strategies
- Email service integration required for verification and password reset
