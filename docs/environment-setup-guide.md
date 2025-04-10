# Environment Setup Guide

This guide explains how to obtain the necessary API keys and credentials for the Attio Integration API.

## Attio Credentials

You mentioned you can already set up Attio variables, but for completeness:

1. Log in to your Attio account
2. Go to Settings > Developer > API Keys
3. Create a new API key with appropriate permissions
4. Copy the API key to your `.env` file:
   ```
   ATTIO_API_KEY=your_api_key_here
   ```

## Zoho Subscriptions Credentials

Since you have access to the Zoho account, follow these steps:

### Step 1: Create a Server-Based Application in Zoho API Console

1. Go to [Zoho API Console](https://api-console.zoho.com/)
2. Click "Add Client" and select "Server-based Applications"
3. Fill in the details:
   - Client Name: "Attio Integration API"
   - Homepage URL: Your company website or `http://localhost:3000` for development
   - Authorized Redirect URIs: `http://localhost:3000/auth/zoho/callback` (for development)
4. Click "Create"
5. You'll receive a **Client ID** and **Client Secret** - save these for your `.env` file

### Step 2: Generate a Refresh Token

1. Construct the following URL (replace `{client_id}` with your actual Client ID):
   ```
   https://accounts.zoho.com/oauth/v2/auth?scope=ZohoSubscriptions.fullaccess.all&client_id={client_id}&response_type=code&access_type=offline&redirect_uri=http://localhost:3000/auth/zoho/callback
   ```
2. Open this URL in your browser
3. Log in to your Zoho account if prompted
4. Authorize the app
5. You'll be redirected to your callback URL with a code parameter (`http://localhost:3000/auth/zoho/callback?code=XXXXX`)
6. Copy the code value from the URL

### Step 3: Exchange the Authorization Code for a Refresh Token

1. Use a tool like cURL, Postman, or a simple Node.js script to make this request:

   ```bash
   curl -X POST https://accounts.zoho.com/oauth/v2/token \
   -d "code=YOUR_AUTHORIZATION_CODE" \
   -d "client_id=YOUR_CLIENT_ID" \
   -d "client_secret=YOUR_CLIENT_SECRET" \
   -d "redirect_uri=http://localhost:3000/auth/zoho/callback" \
   -d "grant_type=authorization_code"
   ```

2. You'll receive a JSON response with a refresh_token - save this value

### Step 4: Get Your Zoho Organization ID

1. Log in to [Zoho Subscriptions](https://subscriptions.zoho.com)
2. Go to Settings > Subscriptions Settings
3. Your Organization ID will be displayed there, or can be found in the URL of your Zoho Subscriptions account (like `https://subscriptions.zoho.com/app#/organizations/{organization_id}/settings`)

### Step 5: Create a Webhook Secret (Optional but Recommended)

1. Generate a secure random string to use as your webhook secret
2. You'll use this later when setting up webhooks in Zoho Subscriptions
3. Add this to your `.env` file as `ZOHO_WEBHOOK_SECRET`

### Add to Your .env File

Add these values to your .env file:

```
ZOHO_CLIENT_ID=your_client_id
ZOHO_CLIENT_SECRET=your_client_secret
ZOHO_REFRESH_TOKEN=your_refresh_token
ZOHO_ORGANIZATION_ID=your_organization_id
ZOHO_WEBHOOK_SECRET=your_webhook_secret
```

## Braintree Sandbox Credentials

For development, you can create a Braintree sandbox account:

### Step 1: Create a Braintree Sandbox Account

1. Go to [Braintree Sandbox Signup](https://www.braintreepayments.com/sandbox)
2. Fill out the form to create a sandbox account
3. You'll receive an email with your login details

### Step 2: Get Your API Credentials

1. Log in to the [Braintree Sandbox Control Panel](https://sandbox.braintreegateway.com/)
2. Go to Account > My User
3. Under API Keys, Authorization & Upgrading, click "View Authorizations"
4. Click "Generate New API Key"
5. You'll receive your:
   - Merchant ID
   - Public Key
   - Private Key

### Step 3: Set Up Webhook Testing (Optional but Recommended)

1. In the Braintree Control Panel, go to Settings > Webhooks
2. Click "Create New Webhook"
3. For local development, you'll need a service like ngrok to expose your local server:
   - Run `ngrok http 3000` to create a tunnel to your local server
   - Use the ngrok URL as your webhook destination (e.g., `https://your-ngrok-subdomain.ngrok.io/webhooks/braintree`)
4. Select the events you want to subscribe to (at minimum: "Subscription Charged Successfully" and "Subscription Charged Unsuccessfully")
5. Braintree will generate a Webhook Testing Gateway for your webhook endpoint
6. Click "Check URL", and if successful, save the webhook
7. Save the Webhook Secret to your `.env` file as `BT_WEBHOOK_SECRET`

### Add to Your .env File

Add these values to your .env file:

```
BT_ENVIRONMENT=sandbox
BT_MERCHANT_ID=your_merchant_id
BT_PUBLIC_KEY=your_public_key
BT_PRIVATE_KEY=your_private_key
BT_WEBHOOK_SECRET=your_webhook_secret
```

## Testing Your Configuration

Once you've set up your `.env` file with all the required credentials, you can test the configuration with this simple script:

```javascript
// test-env.js
require("dotenv").config();

console.log("Environment variables loaded:");
console.log("=============================");

// Check Attio
console.log(
  "Attio API Key:",
  process.env.ATTIO_API_KEY ? "✓ Set" : "✗ Missing"
);

// Check Zoho
console.log(
  "Zoho Client ID:",
  process.env.ZOHO_CLIENT_ID ? "✓ Set" : "✗ Missing"
);
console.log(
  "Zoho Client Secret:",
  process.env.ZOHO_CLIENT_SECRET ? "✓ Set" : "✗ Missing"
);
console.log(
  "Zoho Refresh Token:",
  process.env.ZOHO_REFRESH_TOKEN ? "✓ Set" : "✗ Missing"
);
console.log(
  "Zoho Organization ID:",
  process.env.ZOHO_ORGANIZATION_ID ? "✓ Set" : "✗ Missing"
);
console.log(
  "Zoho Webhook Secret:",
  process.env.ZOHO_WEBHOOK_SECRET ? "✓ Set" : "✗ Missing (optional)"
);

// Check Braintree
console.log(
  "Braintree Environment:",
  process.env.BT_ENVIRONMENT ? "✓ Set" : "✗ Missing"
);
console.log(
  "Braintree Merchant ID:",
  process.env.BT_MERCHANT_ID ? "✓ Set" : "✗ Missing"
);
console.log(
  "Braintree Public Key:",
  process.env.BT_PUBLIC_KEY ? "✓ Set" : "✗ Missing"
);
console.log(
  "Braintree Private Key:",
  process.env.BT_PRIVATE_KEY ? "✓ Set" : "✗ Missing"
);
console.log(
  "Braintree Webhook Secret:",
  process.env.BT_WEBHOOK_SECRET ? "✓ Set" : "✗ Missing (optional)"
);
```

Run with:

```
node test-env.js
```

## Important Security Notes

1. Never commit your `.env` file to version control
2. The `.gitignore` file should include `.env`
3. Always use environment variables for sensitive credentials, never hardcode them
4. Rotate your API keys periodically for better security
5. Use different API keys for development and production environments
