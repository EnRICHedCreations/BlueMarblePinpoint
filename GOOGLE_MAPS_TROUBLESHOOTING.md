# Google Maps "This page can't load Google Maps correctly" Error

If you're seeing this error, it means the API key needs additional configuration in Google Cloud Console.

## Quick Fix

The error message usually appears due to one of these reasons:

### 1. **Billing Not Enabled** (Most Common)
Even though Google offers a free tier ($200/month credit), you MUST enable billing:
- Go to https://console.cloud.google.com/billing
- Link a credit card to your project
- You won't be charged for typical usage (well within free tier)

### 2. **Places API Not Enabled**
- Go to https://console.cloud.google.com/apis/library
- Search for "Places API"
- Click and enable it
- Wait 1-2 minutes for it to activate

### 3. **API Key Restrictions**
If you've restricted your API key, make sure to allow:
- **Application restrictions**: HTTP referrers
  - Add: `http://localhost:*/*`
  - Add: `https://yourdomain.com/*`
- **API restrictions**:
  - Places API
  - Maps JavaScript API

### 4. **Check Browser Console**
Open DevTools (F12) and look for specific error messages:
- "API key not valid" → Check billing is enabled
- "RefererNotAllowedMapError" → Add your domain to allowed referrers
- "REQUEST_DENIED" → Check Places API is enabled

## Test Without Google Maps

The app works perfectly fine without Google autocomplete! If you want to disable it:

1. Remove or comment out `VITE_GOOGLE_MAPS_API_KEY` from `.env`
2. Restart dev server
3. Use basic search (still fully functional)

## Verify Setup

After fixing the issue:
1. Clear browser cache
2. Restart dev server (`npm run dev`)
3. Open browser console - should see no Google Maps errors
4. Start typing an address - autocomplete suggestions should appear

## Still Having Issues?

The most reliable fix is to:
1. Go to https://console.cloud.google.com
2. Enable billing (required)
3. Enable Places API
4. Wait 2-3 minutes
5. Hard refresh browser (Ctrl+Shift+R)
