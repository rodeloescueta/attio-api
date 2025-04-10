# Zoho Refresh Token Helper Guide

This guide will help you obtain a Zoho refresh token using our helper script. This approach works around the connection error you were experiencing with the redirect URL.

## Prerequisites

Make sure you have:

- Your Zoho Client ID from Zoho API Console
- Your Zoho Client Secret from Zoho API Console
- Node.js and pnpm installed

## Step 1: Update the Helper Environment File

1. Open the `helper.env` file in your editor
2. Replace the placeholder values with your actual Zoho credentials:

```
ZOHO_CLIENT_ID=your_actual_client_id_here
ZOHO_CLIENT_SECRET=your_actual_client_secret_here
```

## Step 2: Start the Helper Server

Run the helper script:

```bash
node get-zoho-token.js
```

You should see output like:

```
🚀 Zoho OAuth helper server running at http://localhost:3000

📝 Instructions:
1. Visit this URL in your browser to start the OAuth flow:
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoSubscriptions.fullaccess.all&client_id=YOUR_CLIENT_ID&response_type=code&access_type=offline&redirect_uri=http://localhost:3000/auth/zoho/callback

2. Log in to your Zoho account if prompted
3. Authorize the application
4. You'll be redirected back to this server with the authorization code
5. Follow the instructions shown to exchange the code for a refresh token
```

## Step 3: Complete the OAuth Flow

1. Copy the URL from the console output
2. Open it in your browser
3. Log in to your Zoho account if prompted
4. Authorize the application when asked
5. You'll be redirected to the localhost server with instructions

## Step 4: Exchange the Authorization Code for a Refresh Token

The page you're redirected to will show:

- The authorization code received
- cURL command you can run to exchange the code for a refresh token
- Instructions for Postman if you prefer using that

Choose one of these methods:

### Option A: Using cURL

Copy the cURL command from the page and run it in your terminal. It will look like:

```bash
curl -X POST https://accounts.zoho.com/oauth/v2/token \
-d "code=YOUR_CODE" \
-d "client_id=YOUR_CLIENT_ID" \
-d "client_secret=YOUR_CLIENT_SECRET" \
-d "redirect_uri=http://localhost:3000/auth/zoho/callback" \
-d "grant_type=authorization_code"
```

### Option B: Using Postman

1. Create a new POST request in Postman
2. Use the URL: `https://accounts.zoho.com/oauth/v2/token`
3. Set the Content-Type header to `application/x-www-form-urlencoded`
4. Add the form data as shown in the helper page:
   - code: (the code shown on the page)
   - client_id: (your client ID)
   - client_secret: (your client secret)
   - redirect_uri: http://localhost:3000/auth/zoho/callback
   - grant_type: authorization_code
5. Send the request

## Step 5: Save Your Refresh Token

The response will be a JSON object like:

```json
{
  "access_token": "1000.xxxx...",
  "refresh_token": "1000.xxxx...",
  "expires_in": 3600,
  "api_domain": "https://www.zohoapis.com",
  "token_type": "Bearer"
}
```

Copy the `refresh_token` value and add it to your main `.env` file:

```
ZOHO_REFRESH_TOKEN=1000.xxxx...
```

## Important Notes

1. The refresh token does not expire unless you explicitly revoke it
2. Store it securely as it provides long-term access to your Zoho account
3. You only need to do this process once to get the refresh token

## Troubleshooting

If you encounter any issues:

1. **Expired Code Error**: Authorization codes expire quickly. If you get an error, restart the process and use the code immediately.

2. **Invalid Redirect URI**: Make sure the redirect URI in your Zoho API Console exactly matches `http://localhost:3000/auth/zoho/callback`

3. **Connection Refused**: Ensure the helper server is running when you try to complete the OAuth flow.
