# Quick Setup Guide

## Fix Judge0 API Error

The "Failed to submit code to Judge0 API" error occurs because the API key isn't configured.

### Step 1: Get Judge0 API Key
1. Go to [RapidAPI Judge0](https://rapidapi.com/judge0-official/api/judge0-ce/)
2. Click "Subscribe to Test" (free tier available)
3. Copy your API key from the dashboard

### Step 2: Configure Environment Variables
Create a `.env.local` file in your project root:

```env
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com
JUDGE0_API_KEY=your_actual_api_key_here
```

### Step 3: Restart Development Server
```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm run dev
```

## Fix Language Selection Overlap

The language dropdown is now positioned to avoid the facecam rectangle:
- Moved to left side of editor panel
- Added higher z-index (z-50)
- Added more language options
- Added helpful tip text

## Test the Fix

1. Go to any contest editor page
2. Try changing the language - it should be visible now
3. Click "Run Code" - you should see setup instructions if API key is missing
4. After adding API key, code execution should work properly

## Troubleshooting

### Still seeing API error?
- Check that `.env.local` file exists in project root
- Verify API key is correct (no extra spaces)
- Restart the development server
- Check browser console for detailed error messages

### Language dropdown still hidden?
- Clear browser cache and refresh
- Check if facecam is positioned correctly (top-right corner)
- Try resizing browser window

## Need Help?

- Check the full setup guide: `JUDGE0_SETUP.md`
- Review the error message in the UI for specific guidance
- Check browser console for detailed error logs
