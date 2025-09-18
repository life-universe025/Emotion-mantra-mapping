# 🧪 Edge Functions Testing Guide

## 🚀 Your APIs Are Ready!

Your Supabase Edge Functions are deployed and ready for testing. Here's how to test them in your browser:

## 📋 Available Endpoints

### 1. **GET /mantras** 
- **URL**: `https://gfxfjusxitqjleavtuwy.supabase.co/functions/v1/mantras`
- **Purpose**: Get all mantras
- **Auth**: Required ✅

### 2. **GET /mantras?emotion=ANXIETY**
- **URL**: `https://gfxfjusxitqjleavtuwy.supabase.co/functions/v1/mantras?emotion=ANXIETY`
- **Purpose**: Get mantras filtered by emotion
- **Auth**: Required ✅

### 3. **GET /mantras/:id**
- **URL**: `https://gfxfjusxitqjleavtuwy.supabase.co/functions/v1/mantras/1`
- **Purpose**: Get specific mantra details + audio URL
- **Auth**: Required ✅

### 4. **POST /sessions**
- **URL**: `https://gfxfjusxitqjleavtuwy.supabase.co/functions/v1/sessions`
- **Purpose**: Create practice session + auto-update stats
- **Auth**: Required ✅
- **Body**: `{ mantra_id, repetitions, duration_seconds, notes }`

### 5. **GET /users/:id/stats**
- **URL**: `https://gfxfjusxitqjleavtuwy.supabase.co/functions/v1/user-stats/users/{user_id}/stats`
- **Purpose**: Get user statistics (streak + totals)
- **Auth**: Required ✅

## 🧪 How to Test in Browser

### Method 1: Built-in Test Panel
1. **Start your app**: `npm run dev`
2. **Sign in** to your app
3. **Click the test tube icon** (🧪) in the header
4. **Test each endpoint** with the buttons provided
5. **Check browser console** for detailed logs

### Method 2: Browser Developer Tools
1. **Open your app** in browser
2. **Sign in** to get authentication
3. **Open Developer Tools** (F12)
4. **Go to Console tab**
5. **Use the EdgeFunctionService**:

```javascript
// Get all mantras
const mantras = await EdgeFunctionService.getMantras()

// Get anxiety mantras
const anxietyMantras = await EdgeFunctionService.getMantras('ANXIETY')

// Get specific mantra
const mantra = await EdgeFunctionService.getMantraById(1)

// Create session
const session = await EdgeFunctionService.createSession({
  mantra_id: 1,
  repetitions: 108,
  duration_seconds: 1800,
  notes: 'Great practice!'
})

// Get user stats
const stats = await EdgeFunctionService.getUserStats('your-user-id')
```

## 🔐 Authentication

All endpoints require authentication. The EdgeFunctionService automatically:
- ✅ Gets your current session token
- ✅ Includes it in API requests
- ✅ Handles authentication errors

## 📊 Expected Results

### Successful Responses:
```json
{
  "data": [...], // Your data here
  "error": null
}
```

### Error Responses:
```json
{
  "data": null,
  "error": "Error message"
}
```

## 🚨 Troubleshooting

### If you get 401 Unauthorized:
- ✅ Make sure you're signed in to your app
- ✅ Check that your session is valid
- ✅ Try refreshing the page and signing in again

### If you get 404 Not Found:
- ✅ Check the URL is correct
- ✅ Make sure the Edge Function is deployed
- ✅ Verify the project ID in your environment

### If you get 500 Internal Server Error:
- ✅ Check the browser console for details
- ✅ Verify your database has the required tables
- ✅ Check Supabase dashboard for function logs

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ All test buttons return data (not errors)
- ✅ Console shows successful API calls
- ✅ User stats update after creating sessions
- ✅ Mantras load with proper data structure

## 📝 Next Steps

Once testing is complete:
1. **Integrate Edge Functions** into your existing components
2. **Replace local data** with API calls
3. **Add error handling** for production use
4. **Deploy your app** with the new APIs

Your Edge Functions are production-ready! 🚀
