# Emotion Mantra Mapping API Documentation

## Overview
This document describes the API endpoints for the Emotion Mantra Mapping application. You have multiple implementation options available.

## 🚀 Implementation Options

### Option 1: Supabase Edge Functions (Recommended)
- **Pros**: Serverless, auto-scaling, built-in authentication, no server management
- **Cons**: Deno runtime, learning curve
- **Best for**: Production apps, scalability

### Option 2: Enhanced Supabase Service (Client-Side)
- **Pros**: Simple, uses existing code, no additional infrastructure
- **Cons**: Client-side only, limited server logic
- **Best for**: Quick implementation, simple apps

### Option 3: Express.js API Server
- **Pros**: Full control, familiar Node.js, extensive middleware
- **Cons**: Server management, deployment complexity
- **Best for**: Complex business logic, existing Node.js expertise

### Option 4: API Client Wrapper
- **Pros**: Clean interface, type-safe, easy to use
- **Cons**: Still client-side, limited server features
- **Best for**: Type safety, clean code organization

## 📚 API Endpoints

### 1. GET /mantras?emotion=ANXIETY
Returns a list of mantras, optionally filtered by emotion.

**Parameters:**
- `emotion` (optional): Filter mantras by emotion (e.g., "ANXIETY", "STRESS")

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "slug": "om-namah-shivaya",
      "sanskrit": "ॐ नमः शिवाय",
      "devanagari": "ॐ नमः शिवाय",
      "transliteration": "Om Namah Shivaya",
      "meaning": "I bow to Shiva",
      "audio_url": "https://...",
      "suggested_rounds": 108,
      "emotions": ["ANXIETY", "STRESS"],
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "error": null
}
```

### 2. GET /mantras/:id
Returns details of a specific mantra including audio URL.

**Parameters:**
- `id`: Mantra ID (number)

**Response:**
```json
{
  "data": {
    "id": 1,
    "slug": "om-namah-shivaya",
    "sanskrit": "ॐ नमः शिवाय",
    "devanagari": "ॐ नमः शिवाय",
    "transliteration": "Om Namah Shivaya",
    "meaning": "I bow to Shiva",
    "audio_url": "https://example.com/audio/om-namah-shivaya.mp3",
    "suggested_rounds": 108,
    "emotions": ["ANXIETY", "STRESS"],
    "created_at": "2024-01-01T00:00:00Z"
  },
  "error": null
}
```

### 3. POST /sessions
Creates a new practice session and automatically updates user statistics.

**Headers:**
- `Authorization: Bearer <jwt_token>` (required)

**Body:**
```json
{
  "mantra_id": 1,
  "repetitions": 108,
  "duration_seconds": 1800,
  "notes": "Felt very peaceful during practice"
}
```

**Response:**
```json
{
  "data": {
    "id": 123,
    "user_id": "user-uuid",
    "mantra_id": 1,
    "repetitions": 108,
    "duration_seconds": 1800,
    "notes": "Felt very peaceful during practice",
    "created_at": "2024-01-01T12:00:00Z"
  },
  "stats": {
    "user_id": "user-uuid",
    "last_practice_date": "2024-01-01",
    "current_streak": 5,
    "total_repetitions": 540,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "error": null
}
```

### 4. GET /users/:id/stats
Returns user statistics including streak and total repetitions.

**Headers:**
- `Authorization: Bearer <jwt_token>` (required)

**Parameters:**
- `id`: User ID (UUID)

**Response:**
```json
{
  "data": {
    "user_id": "user-uuid",
    "last_practice_date": "2024-01-01",
    "current_streak": 5,
    "total_repetitions": 540,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "error": null
}
```

## 🔧 Setup Instructions

### For Supabase Edge Functions:
1. Install Supabase CLI: `brew install supabase/tap/supabase`
2. Login: `supabase login`
3. Link project: `supabase link --project-ref YOUR_PROJECT_ID`
4. Deploy: `./deploy-edge-functions.sh`

### For Express.js Server:
1. Navigate to api-server: `cd api-server`
2. Install dependencies: `npm install`
3. Set environment variables in `.env`
4. Start server: `npm run dev`

### For Client-Side Implementation:
1. Use the enhanced `SupabaseService` class
2. Or use the `ApiClient` wrapper for type safety

## 🔐 Authentication

All endpoints except `/mantras` require authentication. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## 🚨 Error Handling

All endpoints return consistent error responses:

```json
{
  "data": null,
  "error": "Error message description"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created (for POST requests)
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `500`: Internal Server Error

## 📝 Usage Examples

### JavaScript/TypeScript:
```typescript
import { ApiClient } from './api/client'

// Get mantras for anxiety
const anxietyMantras = await ApiClient.getMantras('ANXIETY')

// Create a session
const session = await ApiClient.createSession({
  mantra_id: 1,
  repetitions: 108,
  duration_seconds: 1800,
  notes: 'Great practice!'
})

// Get user stats
const stats = await ApiClient.getUserStats('user-id')
```

### cURL:
```bash
# Get mantras
curl "https://your-project.supabase.co/functions/v1/mantras?emotion=ANXIETY"

# Create session
curl -X POST "https://your-project.supabase.co/functions/v1/sessions" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"mantra_id": 1, "repetitions": 108, "duration_seconds": 1800}'
```
